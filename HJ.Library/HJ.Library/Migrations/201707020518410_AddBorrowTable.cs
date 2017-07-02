namespace HJ.Library.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBorrowTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Borrows",
                c => new
                    {
                        BorrowId = c.Guid(nullable: false),
                        BookId = c.Guid(nullable: false),
                        UserName = c.String(),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                        User_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.BorrowId)
                .ForeignKey("dbo.Books", t => t.BookId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id)
                .Index(t => t.BookId)
                .Index(t => t.User_Id);
            
            AddColumn("dbo.Books", "AvailableCopies", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Borrows", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Borrows", "BookId", "dbo.Books");
            DropIndex("dbo.Borrows", new[] { "User_Id" });
            DropIndex("dbo.Borrows", new[] { "BookId" });
            DropColumn("dbo.Books", "AvailableCopies");
            DropTable("dbo.Borrows");
        }
    }
}
