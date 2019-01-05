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
using System.Data.SqlClient;

namespace WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class AttendanceRecordsController : ApiController
    {
		List<AttendanceRecord> attendanceRecords = new List<AttendanceRecord>();
		List<Member> members = new List<Member>();


		public AttendanceRecordsController()
		{

			const string query = @"SELECT * FROM Members;";

			using (var myConn = new SqlConnection(Support.connectionString))
			{

				var myCommand = new SqlCommand(query, myConn);


				//For offline connection we will use MySqlDataAdapter class.  
				var myAdapter = new SqlDataAdapter
				{
					SelectCommand = myCommand
				};

				var dataTable = new DataTable();

				myAdapter.Fill(dataTable);

				if (dataTable.Rows.Count > 0)
				{
					foreach (DataRow row in dataTable.Rows)
					{
						members.Add(Support.CreateItemFromRow<Member>(row));
					}
				}
			}

			const string attendanceQuery = @"SELECT * FROM AttendanceRecords;";

			using (var myConn = new SqlConnection(Support.connectionString))
			{

				var myCommand = new SqlCommand(attendanceQuery, myConn);


				//For offline connection we will use MySqlDataAdapter class.  
				var myAdapter = new SqlDataAdapter
				{
					SelectCommand = myCommand
				};

				var dataTable = new DataTable();

				myAdapter.Fill(dataTable);

				if (dataTable.Rows.Count > 0)
				{
					foreach (DataRow row in dataTable.Rows)
					{
						attendanceRecords.Add(Support.CreateItemFromRow<AttendanceRecord>(row));
					}
				}
			}
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

			using (var myConn = new SqlConnection(Support.connectionString))
			{
				string query = $"INSERT INTO AttendanceRecords (EventID, MemberID) values ({attendanceRecord.EventID}, {attendanceRecord.MemberID})";

				var myCommand = new SqlCommand(query, myConn);

				//Data reader example. Connection must be opened. 
				myConn.Open();

				var numRowsAffected = myCommand.ExecuteNonQuery();

				if (numRowsAffected == 0)
				{
					//TODO: error!
				}

			}

			return response;
		}

		/// <summary>
		/// This API call is used to remove a member from the attendance list of an event.
		/// </summary>
		/// <param name="attendanceRecord">The attendance record to remove</param>
		/// <returns></returns>
		[HttpPost]
		[Route("api/AttendanceRecords/remove")]
		public string RemoveAttendanceRecord([FromBody] AttendanceRecord attendanceRecord)
		{
			string response = "";

			using (var myConn = new SqlConnection(Support.connectionString))
			{
				string query = $"DELETE from AttendanceRecords WHERE EventID = {attendanceRecord.EventID} AND MemberID = {attendanceRecord.MemberID}";

				var myCommand = new SqlCommand(query, myConn);

				//Data reader example. Connection must be opened. 
				myConn.Open();

				var numRowsAffected = myCommand.ExecuteNonQuery();

				if (numRowsAffected == 0)
				{
					//TODO: error!
				}

			}

			return response;
		}
	}
}