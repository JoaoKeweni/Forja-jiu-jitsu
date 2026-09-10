using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Forja.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:uuid-ossp", ",,");

            migrationBuilder.CreateTable(
                name: "academies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_academies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "profiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    AvatarUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_profiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "teams",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    AcademyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Schedule = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_teams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_teams_academies_AcademyId",
                        column: x => x.AcademyId,
                        principalTable: "academies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tournaments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    AcademyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    EventDate = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    Location = table.Column<string>(type: "text", nullable: true),
                    Rules = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tournaments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tournaments_academies_AcademyId",
                        column: x => x.AcademyId,
                        principalTable: "academies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "professor_teams",
                columns: table => new
                {
                    ProfessorId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeamId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_professor_teams", x => new { x.ProfessorId, x.TeamId });
                    table.ForeignKey(
                        name: "FK_professor_teams_profiles_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_professor_teams_teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "students",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AcademyId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeamId = table.Column<Guid>(type: "uuid", nullable: false),
                    Belt = table.Column<string>(type: "text", nullable: false),
                    Degrees = table.Column<int>(type: "integer", nullable: false),
                    DueDay = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_students", x => x.Id);
                    table.CheckConstraint("ck_students_degrees", "degrees >= 0 AND degrees <= 4");
                    table.CheckConstraint("ck_students_due_day", "due_day >= 1 AND due_day <= 31");
                    table.ForeignKey(
                        name: "FK_students_academies_AcademyId",
                        column: x => x.AcademyId,
                        principalTable: "academies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_students_profiles_Id",
                        column: x => x.Id,
                        principalTable: "profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_students_teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tournament_categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    TournamentId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Belt = table.Column<string>(type: "text", nullable: false),
                    AgeGroup = table.Column<string>(type: "text", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: false),
                    MaxWeight = table.Column<decimal>(type: "numeric(5,2)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tournament_categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tournament_categories_tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "tournaments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "payments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    Month = table.Column<int>(type: "integer", nullable: false),
                    Year = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    DueDate = table.Column<DateOnly>(type: "date", nullable: false),
                    PaidAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Method = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payments", x => x.Id);
                    table.CheckConstraint("ck_payments_month", "month >= 1 AND month <= 12");
                    table.CheckConstraint("ck_payments_year", "year >= 2020");
                    table.ForeignKey(
                        name: "FK_payments_students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "category_enrollments",
                columns: table => new
                {
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    WeighedIn = table.Column<bool>(type: "boolean", nullable: false),
                    EnrolledAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_category_enrollments", x => new { x.CategoryId, x.StudentId });
                    table.ForeignKey(
                        name: "FK_category_enrollments_students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_category_enrollments_tournament_categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "tournament_categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "matches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoundName = table.Column<string>(type: "text", nullable: false),
                    Fighter1Id = table.Column<Guid>(type: "uuid", nullable: true),
                    Fighter2Id = table.Column<Guid>(type: "uuid", nullable: true),
                    WinnerId = table.Column<Guid>(type: "uuid", nullable: true),
                    Score = table.Column<string>(type: "text", nullable: true),
                    VictoryType = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_matches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_matches_students_Fighter1Id",
                        column: x => x.Fighter1Id,
                        principalTable: "students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_matches_students_Fighter2Id",
                        column: x => x.Fighter2Id,
                        principalTable: "students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_matches_students_WinnerId",
                        column: x => x.WinnerId,
                        principalTable: "students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_matches_tournament_categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "tournament_categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_academies_Slug",
                table: "academies",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_category_enrollments_StudentId",
                table: "category_enrollments",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_matches_CategoryId",
                table: "matches",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_matches_Fighter1Id",
                table: "matches",
                column: "Fighter1Id");

            migrationBuilder.CreateIndex(
                name: "IX_matches_Fighter2Id",
                table: "matches",
                column: "Fighter2Id");

            migrationBuilder.CreateIndex(
                name: "IX_matches_WinnerId",
                table: "matches",
                column: "WinnerId");

            migrationBuilder.CreateIndex(
                name: "IX_payments_Status",
                table: "payments",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_payments_StudentId",
                table: "payments",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_payments_StudentId_Month_Year",
                table: "payments",
                columns: new[] { "StudentId", "Month", "Year" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_professor_teams_TeamId",
                table: "professor_teams",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_profiles_Email",
                table: "profiles",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_students_AcademyId",
                table: "students",
                column: "AcademyId");

            migrationBuilder.CreateIndex(
                name: "IX_students_Status",
                table: "students",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_students_TeamId",
                table: "students",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_teams_AcademyId",
                table: "teams",
                column: "AcademyId");

            migrationBuilder.CreateIndex(
                name: "IX_tournament_categories_TournamentId",
                table: "tournament_categories",
                column: "TournamentId");

            migrationBuilder.CreateIndex(
                name: "IX_tournaments_AcademyId",
                table: "tournaments",
                column: "AcademyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "category_enrollments");

            migrationBuilder.DropTable(
                name: "matches");

            migrationBuilder.DropTable(
                name: "payments");

            migrationBuilder.DropTable(
                name: "professor_teams");

            migrationBuilder.DropTable(
                name: "tournament_categories");

            migrationBuilder.DropTable(
                name: "students");

            migrationBuilder.DropTable(
                name: "tournaments");

            migrationBuilder.DropTable(
                name: "profiles");

            migrationBuilder.DropTable(
                name: "teams");

            migrationBuilder.DropTable(
                name: "academies");
        }
    }
}
