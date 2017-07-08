namespace HJ.Library.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenamedBorrowedBooksColumnInUserTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "BorrowedBooksCount", c => c.Int(nullable: false));
            DropColumn("dbo.AspNetUsers", "BorrowedBooks");
        }
        
        public override void Down()
        {
            AddColumn("dbo.AspNetUsers", "BorrowedBooks", c => c.Int(nullable: false));
            DropColumn("dbo.AspNetUsers", "BorrowedBooksCount");
        }
    }
}
