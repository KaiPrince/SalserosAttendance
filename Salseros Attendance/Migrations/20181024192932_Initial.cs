using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SalserosAttendance.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AttendanceRecords",
                columns: table => new
                {
                    AttendanceRecordID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Date = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttendanceRecords", x => x.AttendanceRecordID);
                });

            migrationBuilder.CreateTable(
                name: "Members",
                columns: table => new
                {
                    MemberID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    StudentNumber = table.Column<int>(maxLength: 7, nullable: false),
                    CollegeEmail = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    ContactEmail = table.Column<string>(nullable: true),
                    AttendanceRecordID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Members", x => x.MemberID);
                    table.ForeignKey(
                        name: "FK_Members_AttendanceRecords_AttendanceRecordID",
                        column: x => x.AttendanceRecordID,
                        principalTable: "AttendanceRecords",
                        principalColumn: "AttendanceRecordID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Members_AttendanceRecordID",
                table: "Members",
                column: "AttendanceRecordID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Members");

            migrationBuilder.DropTable(
                name: "AttendanceRecords");
        }
    }
}
