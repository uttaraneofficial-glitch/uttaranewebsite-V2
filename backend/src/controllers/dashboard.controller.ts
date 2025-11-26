import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get Dashboard Stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [companiesCount, candidatesCount, videosCount, usersCount] =
      await Promise.all([
        prisma.company.count(),
        prisma.candidate.count(),
        prisma.video.count(),
        prisma.user.count(),
      ]);

    // Mock trend data for now (could be calculated based on created_at if needed)
    const stats = {
      companies: { value: companiesCount, trend: 'up', trendValue: '5%' },
      candidates: { value: candidatesCount, trend: 'up', trendValue: '12%' },
      videos: { value: videosCount, trend: 'up', trendValue: '8%' },
      users: { value: usersCount, trend: 'stable', trendValue: '0%' },
    };

    res.json({ data: stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

// Global Search
export const getGlobalSearch = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.json({ data: { companies: [], candidates: [], videos: [] } });
    }

    const [companies, candidates, videos] = await Promise.all([
      prisma.company.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 5,
      }),
      prisma.candidate.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 5,
        include: { company: true },
      }),
      prisma.video.findMany({
        where: { title: { contains: query, mode: 'insensitive' } },
        take: 5,
        include: { company: true },
      }),
    ]);

    res.json({
      data: {
        companies,
        candidates,
        videos,
      },
    });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};

// Get Notifications (Mocked for now, but structured for API)
export const getNotifications = async (req: Request, res: Response) => {
  try {
    // In a real app, this would fetch from a Notification table
    const notifications = [
      {
        id: 1,
        title: 'New Candidate Registered',
        time: '5 mins ago',
        type: 'info',
      },
      {
        id: 2,
        title: 'Server Backup Completed',
        time: '1 hour ago',
        type: 'success',
      },
      { id: 3, title: 'New Video Uploaded', time: '2 hours ago', type: 'info' },
      {
        id: 4,
        title: 'System Update Available',
        time: '1 day ago',
        type: 'warning',
      },
    ];

    res.json({ data: notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};
// Get Dashboard Charts Data
export const getDashboardCharts = async (req: Request, res: Response) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Content Growth (Last 6 Months)
    const [videos, candidates] = await Promise.all([
      prisma.video.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.candidate.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
    ]);

    // Helper to format date as "MMM" (e.g., "Jan")
    const getMonthName = (date: Date) =>
      date.toLocaleString('default', { month: 'short' });

    const growthMap = new Map<
      string,
      { name: string; videos: number; candidates: number }
    >();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = getMonthName(d);
      growthMap.set(key, { name: key, videos: 0, candidates: 0 });
    }

    videos.forEach(v => {
      const key = getMonthName(v.createdAt);
      if (growthMap.has(key)) growthMap.get(key)!.videos++;
    });

    candidates.forEach(c => {
      const key = getMonthName(c.createdAt);
      if (growthMap.has(key)) growthMap.get(key)!.candidates++;
    });

    const contentGrowth = Array.from(growthMap.values());

    // 2. User Growth (Last 7 Days)
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    });

    const getDayName = (date: Date) =>
      date.toLocaleString('default', { weekday: 'short' });
    const userMap = new Map<string, { name: string; users: number }>();

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = getDayName(d);
      userMap.set(key, { name: key, users: 0 });
    }

    users.forEach(u => {
      const key = getDayName(u.createdAt);
      if (userMap.has(key)) userMap.get(key)!.users++;
    });

    const userGrowth = Array.from(userMap.values());

    // 3. Company Distribution (Top 5 by Video Count)
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: { videos: true },
        },
      },
      orderBy: {
        videos: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    const companyDistribution = companies.map(c => ({
      name: c.name,
      value: c._count.videos,
    }));

    res.json({
      data: {
        contentGrowth,
        userGrowth,
        companyDistribution,
      },
    });
  } catch (error) {
    console.error('Get dashboard charts error:', error);
    res.status(500).json({ message: 'Failed to fetch chart data' });
  }
};
