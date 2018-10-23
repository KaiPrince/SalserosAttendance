using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SalserosAttendance.Data
{
    public class SalserosAttendanceContext : DbContext
    {

        public SalserosAttendanceContext (DbContextOptions<SalserosAttendanceContext> options)
            : base(options)
        {

        }

        public DbSet<SalserosAttendance.Models.Member> Members { get; set; } 
        public DbSet<SalserosAttendance.Models.AttendanceRecord> AttendanceRecords { get; set; }
    }
}
