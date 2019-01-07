using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalserosAttendance.Models;

namespace SalserosAttendance.Data
{
    public class SalserosAttendanceContext : DbContext
    {

        public SalserosAttendanceContext (DbContextOptions<SalserosAttendanceContext> options)
            : base(options)
        {

        }

        public DbSet<Member> Members { get; set; } 
        public DbSet<Event> Events { get; set; }
        public DbSet<AttendanceRecord> AttendanceRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AttendanceRecord>()
                .HasKey(x => new { x.EventID, x.MemberID });
        }
    }
}
