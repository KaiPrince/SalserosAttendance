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
using WebAPI.Models;
using System.Data.SqlClient;
using System.Data;

namespace WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class MembersController : ApiController
	{
		List<Member> members = new List<Member>();
		public MembersController()
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
		}

		[Route("api/Members")]
		public string GetMembers()
		{
			string response = "";

			response = JsonConvert.SerializeObject(members);
			
			

			return response;
		}

		[HttpPost]
		[Route("api/Members/add")]
		public string AddMember([FromBody] Member member)
		{
			string response = "";

			//Validate Member
			//TODO: add validation and handle excceptions in client app
			//if (member.StudentNumber.ToString().Length != )

			members.Add(member);

			using (var myConn = new SqlConnection(Support.connectionString))
			{
				string query = $"INSERT INTO Members (FirstName, LastName, StudentNumber, CollegeEmail, ContactEmail, PhoneNumber) values ('{member.FirstName}', '{member.LastName}', {member.StudentNumber}, '{member.CollegeEmail}', '{member.ContactEmail}', '{member.PhoneNumber}')";

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

		[HttpPost]
		[Route("api/Members/remove")]
		public string RemoveMember([FromBody] Member member)
		{
			string response = "";

			using (var myConn = new SqlConnection(Support.connectionString))
			{
				string query = $"DELETE from Members WHERE MemberID = {member.MemberID};";

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