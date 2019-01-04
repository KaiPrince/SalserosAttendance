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

namespace WebAPI.Controllers
{
	[EnableCors(origins: "*", headers: "*", methods: "*")]
	public class MembersController : ApiController
	{
		List<Member> members;
		public MembersController()
		{
			members = new List<Member>
			{
				new Member { MemberID = 1, FirstName = "Kai", LastName = "Prince", StudentNumber = 7952807 },
				new Member {MemberID = 2, FirstName = "Tyler", LastName = "Myles", StudentNumber = 2134567},
			};
		}

		[Route("api/Members")]
		public string GetMembers()
		{
			string response = "";

			response = JsonConvert.SerializeObject(members);
			
			

			return response;
		}
    }
}