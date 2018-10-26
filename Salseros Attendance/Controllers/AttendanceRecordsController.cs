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
        public IEnumerable<Member> GetToday()
        {
            //TODO: change this to return a list of ints, members, or a single attendance record
            //TODO change name or return type.
            //TODO: change return type to minimize amount of data sent.
            //IEnumerable<Member> todayRecord = _context.Events.Where(x => x.Date == DateTime.Now.Date).SelectMany(x => x.AttendanceRecords.Select(y => y.Member));

            //Get today's eventID
            Event todayEvent = _context.Events.Where(x => x.Date == DateTime.Now.Date).SingleOrDefault();
            //  TODO: change this to use ID integer only, for optimized processing

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
            IEnumerable<Member> attendingMembers = _context.AttendanceRecords.Where(x => x.Event == todayEvent).Select(x => x.Member);
            
            return attendingMembers;
        }

        // GET: api/AttendanceRecords
        [HttpGet("all")]
        public IEnumerable<AttendanceRecord> GetAttendanceRecords()
        {
            return _context.AttendanceRecords.ToList();
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