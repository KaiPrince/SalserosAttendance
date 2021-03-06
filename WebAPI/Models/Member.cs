﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Member
    {
        public int MemberID { get; set; }
        
        //TODO: Add Name validation here using regex
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

		[Required]
        //[MaxLength(7)]
        public int StudentNumber { get; set; }

        //TODO: Make this required?
		[Required]
        [EmailAddress]
        public string CollegeEmail { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }

        [EmailAddress]
        public string ContactEmail { get; set; }

		
    }
}
