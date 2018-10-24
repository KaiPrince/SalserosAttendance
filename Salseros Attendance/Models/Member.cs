using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SalserosAttendance.Models
{
    public class Member
    {
        public int MemberID { get; set; }
        
        public string FirstName { get; set; }

        public string LastName { get; set; }

        [MaxLength(7)]
        public int StudentNumber { get; set; }

        [EmailAddress]
        public string CollegeEmail { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }

        [EmailAddress]
        public string ContactEmail { get; set; }
    }
}
