using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SalserosAttendance.Models
{
    public class Event
    {
        public Event()
        {

            Date = DateTime.Now.Date;
        }

        public int EventID { get; set; }

        public string Title { get; set; }

        //TODO: add validation for this to only ever be a date. Setter, data-annotations, validation logic?
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }


        public ICollection<AttendanceRecord> AttendanceRecords { get; set; }
    }
}
