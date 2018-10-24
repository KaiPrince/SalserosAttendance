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

        // GET: api/AttendanceRecords
        [HttpGet]
        public IEnumerable<AttendanceRecord> GetAttendanceRecords()
        {
            return _context.AttendanceRecords;
        }

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
        public async Task<IActionResult> PostAttendanceRecord([FromBody] AttendanceRecord attendanceRecord)
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
    }
}