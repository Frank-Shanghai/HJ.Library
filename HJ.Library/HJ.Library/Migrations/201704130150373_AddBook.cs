namespace HJ.Library.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBook : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Books",
                c => new
                    {
                        BookId = c.Guid(nullable: false),
                        ISBN = c.String(),
                        Name = c.String(nullable: false),
                        Author = c.String(nullable: false),
                        Publisher = c.String(),
                        PublicationDate = c.DateTime(nullable: false),
                        Pages = c.Int(nullable: false),
                        Copies = c.Int(nullable: false),
                        Status = c.Int(nullable: false),
                        Owner = c.String(),
                        Comment = c.String(),
                    })
                .PrimaryKey(t => t.BookId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Books");
        }
    }
}
