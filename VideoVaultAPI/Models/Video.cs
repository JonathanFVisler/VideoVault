public class Video
{
    public int Id { get; set; }
    public required string FileName { get; set; }
    public required string FilePath { get; set; }
    public string Creator { get; set; } = string.Empty;
    public string ThumbnailPath { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
}