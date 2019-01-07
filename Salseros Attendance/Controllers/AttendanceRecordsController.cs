using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalserosAttendance.Data;
using SalserosAttendance.Models;

namespace Salseros_Attendance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceRecordsController : ControllerBase
    {
        private readonly SalserosAttendanceContext _context;

        public AttendanceRecordsController(SalserosAttendanceContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get today's attendance record.
        /// </summary>
        /// <returns>IEnumerable</returns>
        //[HttpGet("[action]")]
        [HttpGet]
        public IEnumerable<int> GetToday()
        {
            //TODO change name or return type.

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
            //  TODO: change this to use ID integer only, for optimized processing

            //TODO: for testing only, we will hardcode the first event, until we finish crud functionality
            todayEvent = _context.Events.FirstOrDefault(); //REMOVE

            //... or Create Event
            if (todayEvent == null)
            {
                todayEvent = new Event()
                {
                    Date = DateTime.Now.Date,
                    Title = "Salsa Lesson",
                };
                _context.Add(todayEvent);
                _context.SaveChanges();
            }

			//Get Attending Members
			var attendanceResults = _context.AttendanceRecords.Where(x => x.EventID == todayEvent.EventID).Select(x => x.MemberID);
			
			IEnumerable<Member> attendingMembers = _context.Members.Where(x => attendanceResults.Any(y => y == x.MemberID));

			IEnumerable<int> attendingMemberIDs = attendingMembers.Select(x => x.MemberID);

            return attendingMemberIDs;
        }

        // GET: api/AttendanceRecords
        [HttpGet("all")]
        public IEnumerable<AttendanceRecord> GetAllAttendanceRecords()
        {
            return _context.AttendanceRecords.ToList();
        }

		[HttpPut("[action]/{id}")]
		public async Task<IActionResult> AttendTodayEvent([FromRoute] int id)
		{//TODO: change this to take an EventID instead
			Event todayEvent = _context.Events.FirstOrDefault();//_context.Events.Where(x => x.Date == DateTime.Now.Date).LastOrDefault();
			if (todayEvent == null)
			{
				//TODO create event
			}

			var attendanceRecord = new AttendanceRecord
			{
				EventID = todayEvent.EventID,
				MemberID = id,
			};

			//TODO: don't allow duplicate adding of members
			await _context.AttendanceRecords.AddAsync(attendanceRecord);
			await _context.SaveChangesAsync();

			return Ok();
		}

		/*
        // GET: api/AttendanceRecords/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAttendanceRecord([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var attendanceRecord = await _context.AttendanceRecords.FindAsync(id);

            if (attendanceRecord == null)
            {
                return NotFound();
            }

            return Ok(attendanceRecord);
        }

        // PUT: api/AttendanceRecords/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttendanceRecord([FromRoute] int id, [FromBody] AttendanceRecord attendanceRecord)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != attendanceRecord.AttendanceRecordID)
            {
                return BadRequest();
            }

            _context.Entry(attendanceRecord).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttendanceRecordExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        

        // POST: api/AttendanceRecords
        [HttpPost]
        public async Task<IActionResult> PostAttendanceRecord([FromBody] Event attendanceRecord)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.AttendanceRecords.Add(attendanceRecord);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttendanceRecord", new { id = attendanceRecord.AttendanceRecordID }, attendanceRecord);
        }

        // DELETE: api/AttendanceRecords/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendanceRecord([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var attendanceRecord = await _context.AttendanceRecords.FindAsync(id);
            if (attendanceRecord == null)
            {
                return NotFound();
            }

            _context.AttendanceRecords.Remove(attendanceRecord);
            await _context.SaveChangesAsync();

            return Ok(attendanceRecord);
        }

        private bool AttendanceRecordExists(int id)
        {
            return _context.AttendanceRecords.Any(e => e.AttendanceRecordID == id);
        }
        */
	}
}