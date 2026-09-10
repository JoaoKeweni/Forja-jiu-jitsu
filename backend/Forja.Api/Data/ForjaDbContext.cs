using Forja.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Data;

public class ForjaDbContext(DbContextOptions<ForjaDbContext> options) : DbContext(options)
{
    public DbSet<Academy> Academies => Set<Academy>();
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<ProfessorTeam> ProfessorTeams => Set<ProfessorTeam>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Tournament> Tournaments => Set<Tournament>();
    public DbSet<TournamentCategory> TournamentCategories => Set<TournamentCategory>();
    public DbSet<CategoryEnrollment> CategoryEnrollments => Set<CategoryEnrollment>();
    public DbSet<Match> Matches => Set<Match>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);

        // Enums como texto no PostgreSQL (legível e estável)
        b.HasPostgresExtension("uuid-ossp");

        // ── Academy ──
        b.Entity<Academy>(e =>
        {
            e.ToTable("academies");
            e.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");
            e.Property(x => x.CreatedAt).HasDefaultValueSql("now()");
            e.HasIndex(x => x.Slug).IsUnique();
        });

        // ── Team ──
        b.Entity<Team>(e =>
        {
            e.ToTable("teams");
            e.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");
            e.Property(x => x.CreatedAt).HasDefaultValueSql("now()");
            e.HasIndex(x => x.AcademyId);
            e.HasOne(x => x.Academy).WithMany(a => a.Teams)
                .HasForeignKey(x => x.AcademyId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── Profile ──
        b.Entity<Profile>(e =>
        {
            e.ToTable("profiles");
            e.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");
            e.Property(x => x.CreatedAt).HasDefaultValueSql("now()");
            e.Property(x => x.Role).HasConversion<string>();
            e.HasIndex(x => x.Email).IsUnique();
        });

        // ── ProfessorTeam (N:N) ──
        b.Entity<ProfessorTeam>(e =>
        {
            e.ToTable("professor_teams");
            e.HasKey(x => new { x.ProfessorId, x.TeamId });
            e.HasOne(x => x.Professor).WithMany(p => p.ProfessorTeams)
                .HasForeignKey(x => x.ProfessorId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Team).WithMany(t => t.ProfessorTeams)
                .HasForeignKey(x => x.TeamId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── Student (1:1 com Profile via PK compartilhada) ──
        b.Entity<Student>(e =>
        {
            e.ToTable("students");
            e.Property(x => x.CreatedAt).HasDefaultValueSql("now()");
            e.Property(x => x.Belt).HasConversion<string>();
            e.Property(x => x.Status).HasConversion<string>();
            e.HasIndex(x => x.AcademyId);
            e.HasIndex(x => x.TeamId);
            e.HasIndex(x => x.Status);
            e.ToTable(t =>
            {
                t.HasCheckConstraint("ck_students_degrees", "degrees >= 0 AND degrees <= 4");
                t.HasCheckConstraint("ck_students_due_day", "due_day >= 1 AND due_day <= 31");
            });

            e.HasOne(x => x.Profile).WithOne(p => p.Student)
                .HasForeignKey<Student>(x => x.Id).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Academy).WithMany(a => a.Students)
                .HasForeignKey(x => x.AcademyId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Team).WithMany(t => t.Students)
                .HasForeignKey(x => x.TeamId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── Payment ──
        b.Entity<Payment>(e =>
        {
            e.ToTable("payments");
            e.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");
            e.Property(x => x.CreatedAt).HasDefaultValueSql("now()");
            e.Property(x => x.Amount).HasColumnType("decimal(10,2)");
            e.Property(x => x.Method).HasConversion<string>();
            e.Property(x => x.Status).HasConversion<string>();
            e.HasIndex(x => x.StudentId);
            e.HasIndex(x => x.Status);
            e.HasIndex(x => new { x.StudentId, x.Month, x.Year }).IsUnique();
            e.ToTable(t =>
            {
                t.HasCheckConstraint("ck_payments_month", "month >= 1 AND month <= 12");
                t.HasCheckConstraint("ck_payments_year", "year >= 2020");
            });
            e.HasOne(x => x.Student).WithMany(s => s.Payments)
                .HasForeignKey(x => x.StudentId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── Tournament ──
        b.Entity<Tournament>(e =>
        {
            e.ToTable("tournaments");
            e.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");
            e.Property(x => x.CreatedAt).HasDefaultValueSql("now()");
            e.Property(x => x.Status).HasConversion<string>();
            e.HasOne(x => x.Academy).WithMany(a => a.Tournaments)
                .HasForeignKey(x => x.AcademyId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── TournamentCategory ──
        b.Entity<TournamentCategory>(e =>
        {
            e.ToTable("tournament_categories");
            e.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");
            e.Property(x => x.CreatedAt).HasDefaultValueSql("now()");
            e.Property(x => x.Belt).HasConversion<string>();
            e.Property(x => x.MaxWeight).HasColumnType("decimal(5,2)");
            e.HasOne(x => x.Tournament).WithMany(t => t.Categories)
                .HasForeignKey(x => x.TournamentId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── CategoryEnrollment (N:N aluno<->categoria) ──
        b.Entity<CategoryEnrollment>(e =>
        {
            e.ToTable("category_enrollments");
            e.HasKey(x => new { x.CategoryId, x.StudentId });
            e.Property(x => x.EnrolledAt).HasDefaultValueSql("now()");
            e.HasOne(x => x.Category).WithMany(c => c.Enrollments)
                .HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Student).WithMany(s => s.CategoryEnrollments)
                .HasForeignKey(x => x.StudentId).OnDelete(DeleteBehavior.Cascade);
        });

        // ── Match ──
        b.Entity<Match>(e =>
        {
            e.ToTable("matches");
            e.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");
            e.Property(x => x.CreatedAt).HasDefaultValueSql("now()");
            e.Property(x => x.Status).HasConversion<string>();
            e.HasOne(x => x.Category).WithMany(c => c.Matches)
                .HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Fighter1).WithMany()
                .HasForeignKey(x => x.Fighter1Id).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.Fighter2).WithMany()
                .HasForeignKey(x => x.Fighter2Id).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.Winner).WithMany()
                .HasForeignKey(x => x.WinnerId).OnDelete(DeleteBehavior.SetNull);
        });
    }
}
