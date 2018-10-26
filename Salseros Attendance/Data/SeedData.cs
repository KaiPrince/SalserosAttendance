using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SalserosAttendance.Models;

namespace SalserosAttendance.Data
{
    /**
     * \brief : \public static \class SeedData
     * \param : N/A
     * \brief : Class responsible for seeding the mass client adder functionality
     */
    public static class SeedData
    {
        /**
         * \breif :  \public static void Initialize(IServiceProvider serviceProvider)
         * \param : <b>IServiceProvider serviceProvider</b> - 
         * \details: 
         * \return : N/A
        */
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new SalserosAttendanceContext(
                serviceProvider.GetRequiredService<DbContextOptions<SalserosAttendanceContext>>()))
            {

                if (!context.Members.Any())
                {
                    context.Members.AddRange(
                    new Member
                    {
                        FirstName = "Kai",
                        LastName = "Prince",
                        StudentNumber = 7952807,
                        CollegeEmail = "kprince2807@conestogac.on.ca",
                        PhoneNumber = "289-981-2006",
                        ContactEmail = "kaiprince72@gmail.com"
                    },
                    new Member
                    {
                        FirstName = "Tyler",
                        LastName = "Myles",
                        StudentNumber = 1234567,
                        CollegeEmail = "tmyles4567@conestogac.on.ca",
                    }
                    );
                }

                if (!context.Events.Any())
                {
                    context.Events.AddRange(
                        new Event
                        {
                            Title = "Salsa Lesson",
                        },
                        new Event
                        {
                            Title = "Halloween Party",
                            Date = DateTime.Parse("Oct 31, 2018").Date,
                        }
                        );
                }

                if (!context.AttendanceRecords.Any())
                {
                    foreach (var member in context.Members)
                    {
                        context.AttendanceRecords.AddRange(
                                new AttendanceRecord
                                {
                                    EventID = context.Events.First().EventID,
                                    Event = context.Events.First(),
                                    MemberID = member.MemberID,
                                    Member = member,
                                }
                         );
                    }

                }

                context.SaveChanges();
            }

        }

        /**
          * \breif : /public static Member GenerateRandomEntry()
          * \param : N/A
          * \details: randomly generates a seeded name
          * \return : member
         */
        /*
       public static Member GenerateRandomEntry()
       {

           var random = new Random();

           string[] randomFirstName = { "Kai", "Connor", "Samuel", "Gabe" };
           string[] randomLastName = { "Prince", "Lynch", "Oloruntoba", "Doomy" };

           string randomYear = random.Next(1980, 2018).ToString();
           string randomMonth = random.Next(1, 13).ToString();
           string randomDay = random.Next(1, 29).ToString();
           string randomDOB = randomYear + "-" + randomMonth + "-" + randomDay;

           return new Member
           {
               FirstName = randomFirstName[random.Next(0, randomFirstName.Count())],
               LastName = randomLastName[random.Next(0, randomLastName.Count())],
               DateOfBirth = DateTime.Parse(randomDOB)
           };

       }
       */
    }
}
