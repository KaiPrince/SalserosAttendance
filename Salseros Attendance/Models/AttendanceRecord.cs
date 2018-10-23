using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SalserosAttendance.Models
{
    public class AttendanceRecord
    {
        public int AttendanceRecordID { get; set; }
        
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        public List<Member> Members { get; set; }
    }
}
