using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SalserosAttendance.Migrations
{
    public partial class AttendanceRecordTimeColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AlterColumn<string>(
                name: "CollegeEmail",
                table: "Members",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Time",
                table: "AttendanceRecords",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Time",
                table: "AttendanceRecords");

            migrationBuilder.AlterColumn<string>(
                name: "CollegeEmail",
                table: "Members",
                nullable: true,
                oldClrType: typeof(string));
        }
    }
}
