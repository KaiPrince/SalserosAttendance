using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SalserosAttendance.Models
{
    public class AttendanceRecord
    {
        public AttendanceRecord()
        {
        }

        public int EventID { get; set; }
        
        public int MemberID { get; set; }
    }
}
