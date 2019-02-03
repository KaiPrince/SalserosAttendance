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
		/// Get attendance record for an event. Default is today.
		/// </summary>
		/// <param name="id">The EventID.</param>
		/// <returns>A list of MemberID.</returns>
		//[HttpGet("[action]")]
		[HttpGet("{id?}")]
		public IEnumerable<int> GetAttendanceRecord([FromRoute] int? id)
		{
			IEnumerable<int> results;

			Event @event;
			if (id == null)
			{
				//Get today's event
				Event todayEvent = Event.GetToday(_context);
				

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

				@event = todayEvent;
			}
			else
			{
				@event = _context.Events.Find(id);

			}

			if (@event == null)
			{
				return new List<int> { };
			}





			//Get Attending Members
			var attendanceResults = _context.AttendanceRecords.Where(x => x.EventID == @event.EventID).Select(x => x.MemberID);

			IEnumerable<Member> attendingMembers = _context.Members.Where(x => attendanceResults.Any(y => y == x.MemberID));

			results = attendingMembers.Select(x => x.MemberID);

			return results;
		}

		// GET: api/AttendanceRecords
		[HttpGet("all")]
		public IEnumerable<AttendanceRecord> GetAllAttendanceRecords()
		{
			return _context.AttendanceRecords.ToList();
		}

		[HttpPost("[action]")]
		public async Task<IActionResult> AttendEvent([FromBody] AttendanceRecord attendanceRecord)
		{
			
			if (!_context.AttendanceRecords.Any(x => x.EventID == attendanceRecord.EventID && x.MemberID == attendanceRecord.MemberID))
			{
				await _context.AttendanceRecords.AddAsync(attendanceRecord);
			}
			
			await _context.SaveChangesAsync();

			return Ok();
		}

		[HttpPost("remove")]
		public async Task<IActionResult> DeleteAttendanceRecord([FromBody] AttendanceRecord attendanceRecord)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (!_context.AttendanceRecords.Any(x => x.EventID == attendanceRecord.EventID && x.MemberID == attendanceRecord.MemberID))
			{
				return NotFound();
			}

			_context.AttendanceRecords.Remove(attendanceRecord);
			await _context.SaveChangesAsync();

			return Ok(attendanceRecord);
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