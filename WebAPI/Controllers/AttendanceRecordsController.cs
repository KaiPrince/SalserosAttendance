using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.Web.Http.Cors;
using System.IO;
using System.Data;
using System.Configuration;
using WebAPI.Models;

namespace WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class AttendanceRecordsController : ApiController
    {
		List<AttendanceRecord> attendanceRecords;
		List<Member> members;

		string connectionString = ConfigurationManager.ConnectionStrings["LocalDB"].ConnectionString;

		public AttendanceRecordsController()
		{

			members = new List<Member>
			{
				new Member { MemberID = 1, FirstName = "Kai", LastName = "Prince", StudentNumber = 7952807 },
				new Member {MemberID = 2, FirstName = "Tyler", LastName = "Myles", StudentNumber = 2134567},
			};


			attendanceRecords = new List<AttendanceRecord>
			{
				new AttendanceRecord { MemberID = 2, EventID = 1 },
			};
		}


		/// <summary>
		/// This API call is used to get all attendance records.
		/// </summary>
		/// <returns></returns>
		[Route("api/AttendanceRecords")]
		public string GetAll()
		{
			string response = "";

			response = JsonConvert.SerializeObject(attendanceRecords);

			return response;
		}

		/// <summary>
		/// This API call is used to get an attendance list for an event.
		/// </summary>
		/// <param name="eventID">The ID of the event.</param>
		/// <returns>A list of attending members.</returns>
		[Route("api/AttendanceRecords/{eventID}")]
		public string Get(int eventID)
		{
			string response = "";

			var attendanceResults = attendanceRecords.Where(x => x.EventID == eventID).Select(x => x.MemberID);

			var results = members.Where(x => attendanceResults.Any(y => y == x.MemberID));

			response = JsonConvert.SerializeObject(results);

			return response;
		}

		/// <summary>
		/// This API call is used to add a member to the attendance list of an event.
		/// </summary>
		/// <param name="eventID">The event to attend.</param>
		/// <param name="memberID">The member attending.</param>
		/// <returns></returns>
		[HttpPost]
		[Route("api/AttendanceRecords/attend")]
		public string AddAttendanceRecord([FromBody] AttendanceRecord attendanceRecord)
		{
			string response = "";

			attendanceRecords.Add(new AttendanceRecord { EventID = attendanceRecord.EventID, MemberID = attendanceRecord.MemberID });

			return response;
		}
	}
}