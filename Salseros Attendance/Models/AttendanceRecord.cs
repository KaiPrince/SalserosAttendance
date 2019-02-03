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

        public DateTime Time { get; set; }
    }

	public class AttendanceRecordEqualityComparer : IEqualityComparer<AttendanceRecord>
	{
		public bool Equals(AttendanceRecord a1, AttendanceRecord a2)
		{
			if (a2 == null && a1 == null)
				return true;
			else if (a1 == null || a2 == null)
				return false;
			else if (a1.EventID == a2.EventID && a1.MemberID == a2.MemberID)
				return true;
			else
				return false;
		}

		public int GetHashCode(AttendanceRecord attendanceRecord)
		{
			//int hCode = attendanceRecord.EventID ^ attendanceRecord.MemberID;
			return base.GetHashCode();
		}
	}
}
