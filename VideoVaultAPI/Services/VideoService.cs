public class VideoService : IVideoService
{
    public readonly VideoContext _context;
    private readonly string _videoFolder = "Videos"; //TODO: Make this configurable

    public VideoService(VideoContext context)
    {
        _context = context;
    }

    public IEnumerable<string> GetAllVideoPaths()
    {
        if (!Directory.Exists(_videoFolder))
        {
            return Enumerable.Empty<string>();
        }

        return Directory.EnumerateFiles(_videoFolder, "*.mp4");
    }

    public IEnumerable<Video> GetAllVideoDetails()
    {
        return _context.Videos.ToList();
    }

    public Video? GetVideoByPath(string path)
    {
        throw new NotImplementedException();
    }

    public Video? GetVideoById(int id)
    {
        return _context.Videos.FirstOrDefault(v => v.Id == id);
    }

    public string? GetVideoDetailsByPath(string path)
    {
        throw new NotImplementedException();
    }

    public string? GetVideoIdByPath(string path)
    {
        throw new NotImplementedException();
    }

    public string? GetVideoNameByPath(string path)
    {
        throw new NotImplementedException();
    }

    public string? GetVideoPathById(int id)
    {
        throw new NotImplementedException();
    }

    public string? GetVideoPathByName(string name)
    {
        throw new NotImplementedException();
    }

    public bool AddVideo(Video video)
    {
        if (video == null)
        {
            return false;
        }

        _context.Videos.Add(video);
        _context.SaveChanges();
        return true;
    }
}