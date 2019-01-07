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

        [Required]
        public string Title { get; set; }

        //TODO: add validation for this to only ever be a date. Setter, data-annotations, validation logic?
        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }
		
		/// <summary>
		/// This method is used to get today's event.
		/// </summary>
		/// <param name="_context">Database context</param>
		/// <returns>Today's event.</returns>
		public static Event GetToday(SalserosAttendance.Data.SalserosAttendanceContext _context)
		{
			//Get today's eventID
			Event todayEvent;
			var allTodayEvents = _context.Events.Where(x => x.Date == DateTime.Now.Date);
			try
			{
				todayEvent = allTodayEvents.SingleOrDefault();
			}
			catch (InvalidOperationException)
			{
				//If there is more than one event on the same day, we will simply use the last (newest) one
				todayEvent = allTodayEvents.LastOrDefault();
				//TODO: change this to just use LastOrDefault on the first try instead of two statements.
			}

			return todayEvent;
		}
    }
}
