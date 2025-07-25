import Job from '../models/Job.model.js';
import RegisterUser  from '../models/RegisterUser.model.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const currentDate = new Date();
        
        // Basic job counts
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ 
            JobDeadline: { $gte: currentDate } 
        });
        const expiredJobs = await Job.countDocuments({ 
            JobDeadline: { $lt: currentDate } 
        });
        
        // Jobs posted this month
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const jobsThisMonth = await Job.countDocuments({
            postedDate: { $gte: startOfMonth }
        });
        
        // Jobs posted this week
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const jobsThisWeek = await Job.countDocuments({
            postedDate: { $gte: startOfWeek }
        });

         // Count users by role
const [counselors, employees, jobseekers, counselees] = await Promise.all([
    RegisterUser.countDocuments({ roles: 'COUNSELOR' }),
   RegisterUser.countDocuments({ roles: 'EMPLOYEE' }),
   RegisterUser.countDocuments({ roles: 'JOBSEEKER' }),
RegisterUser.countDocuments({ roles: 'COUNSELEE' }),
]);     

        


        res.json({
            success: true,
            stats: {
                totalJobs,
                activeJobs,
                expiredJobs,
                jobsThisMonth,
                jobsThisWeek,
                counselors,
                employees,
                jobseekers,
                counselees
                
            }
        });


        console

       
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics'
        });
    }
};





// Get monthly job analytics
export const getMonthlyAnalytics = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        
        // Get jobs posted per month
        const jobsPerMonth = await Job.aggregate([
            {
                $match: {
                    postedDate: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$postedDate' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get jobs with deadlines per month
        const deadlinesPerMonth = await Job.aggregate([
            {
                $match: {
                    JobDeadline: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$JobDeadline' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get senior level jobs per month
        const seniorJobsPerMonth = await Job.aggregate([
            {
                $match: {
                    postedDate: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    },
                    JobExperienceYears: { $gte: 3 }
                }
            },
            {
                $group: {
                    _id: { $month: '$postedDate' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Create arrays for all 12 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const jobsData = new Array(12).fill(0);
        const deadlinesData = new Array(12).fill(0);
        const seniorJobsData = new Array(12).fill(0);

        // Fill data arrays
        jobsPerMonth.forEach(item => {
            jobsData[item._id - 1] = item.count;
        });

        deadlinesPerMonth.forEach(item => {
            deadlinesData[item._id - 1] = item.count;
        });

        seniorJobsPerMonth.forEach(item => {
            seniorJobsData[item._id - 1] = item.count;
        });

        res.json({
            success: true,
            analytics: {
                months,
                jobsData,
                deadlinesData,
                seniorJobsData
            }
        });
    } catch (error) {
        console.error('Error fetching monthly analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching monthly analytics'
        });
    }
};

// Get job type distribution
export const getJobTypeDistribution = async (req, res) => {
    try {
        const jobTypes = await Job.aggregate([
            {
                $group: {
                    _id: '$JobType',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json({
            success: true,
            jobTypes
        });
    } catch (error) {
        console.error('Error fetching job type distribution:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching job type distribution'
        });
    }
};

// Get job mode distribution
export const getJobModeDistribution = async (req, res) => {
    try {
        const jobModes = await Job.aggregate([
            {
                $group: {
                    _id: '$JobMode',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json({
            success: true,
            jobModes
        });
    } catch (error) {
        console.error('Error fetching job mode distribution:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching job mode distribution'
        });
    }
};

// Get experience level distribution
export const getExperienceLevelDistribution = async (req, res) => {
    try {
        const experienceLevels = await Job.aggregate([
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$JobExperienceYears', 0] }, 'Entry Level',
                            { $cond: [
                                { $lte: ['$JobExperienceYears', 2] }, 'Junior (0-2 years)',
                                { $cond: [
                                    { $lte: ['$JobExperienceYears', 5] }, 'Mid-Level (3-5 years)',
                                    'Senior (5+ years)'
                                ]}
                            ]}
                        ]
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json({
            success: true,
            experienceLevels
        });
    } catch (error) {
        console.error('Error fetching experience level distribution:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching experience level distribution'
        });
    }
};

// Get recent jobs activity
export const getRecentActivity = async (req, res) => {
    try {
        const recentJobs = await Job.find()
            .sort({ postedDate: -1 })
            .limit(10)
            .select('JobTitle JobType JobMode postedDate JobDeadline');

        const expiringJobs = await Job.find({
            JobDeadline: {
                $gte: new Date(),
                $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        })
        .sort({ JobDeadline: 1 })
        .limit(5)
        .select('JobTitle JobType JobDeadline');

        res.json({
            success: true,
            recentActivity: {
                recentJobs,
                expiringJobs
            }
        });
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent activity'
        });
    }
};

// ✅ 2. Monthly User Analytics (admin chart)
export const getMonthlyUserAnalytics = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const rolesList = ["EMPLOYEE", "COUNSELOR", "COUNSELEE", "JOBSEEKER"];

    const userAnalytics = await RegisterUser.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          },
          roles: { $in: rolesList }
        }
      },
      { $unwind: "$roles" },
      { $match: { roles: { $in: rolesList } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            role: "$roles"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: months[i],
      employees: 0,
      counselors: 0,
      counselees: 0,
      jobseekers: 0
    }));

    userAnalytics.forEach(entry => {
      const monthIndex = entry._id.month - 1;
      const role = entry._id.role;
      const count = entry.count;

      if (role === "EMPLOYEE") monthlyData[monthIndex].employees += count;
      if (role === "COUNSELOR") monthlyData[monthIndex].counselors += count;
      if (role === "COUNSELEE") monthlyData[monthIndex].counselees += count;
      if (role === "JOBSEEKER") monthlyData[monthIndex].jobseekers += count;
    });

    res.json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    console.error("Error fetching monthly user analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user analytics"
    });
  }
};

