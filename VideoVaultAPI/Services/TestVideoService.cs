public class TestVideoService : IVideoService
{
    private List<Video> _videos = new List<Video>();
    private bool _isInitialized = false;


    public TestVideoService()
    {
        Initialize();
    }

    private void Initialize()
    {
        if (_isInitialized) return;

        // Add some test videos
        _videos.Add(new Video { Id = 1, FileName = "Test Video 1", FilePath = "Videos/test1.mp4", Duration = new TimeSpan(1, 25, 45) });
        _videos.Add(new Video { Id = 2, FileName = "Test Video 2", FilePath = "Videos/test2.mp4", Duration = new TimeSpan(0, 2, 30) });
        _videos.Add(new Video { Id = 3, FileName = "Test Video 3", FilePath = "Videos/test3.mp4", Duration = new TimeSpan(0, 2, 35) });

        _isInitialized = true;
    }

    public IEnumerable<string> GetAllVideoPaths()
    {
        return _videos.Select(v => v.FilePath);
    }

    public IEnumerable<Video> GetAllVideoDetails()
    {
        return _videos;
    }

    public Video? GetVideoByPath(string path)
    {
        Video? video = _videos.FirstOrDefault(v => v.FilePath == path);
        return video;
    }

    public Video? GetVideoById(int id)
    {
        return _videos.FirstOrDefault(v => v.Id == id);
    }

    public string GetVideoDetailsByPath(string path)
    {
        var video = _videos.FirstOrDefault(v => v.FilePath == path);
        return video != null ? $"{video.FileName} - {video.Duration}" : "No details where found for the path: \"" + path + "\"";
    }

    public string? GetVideoIdByPath(string path)
    {
        Video? video = _videos.FirstOrDefault(v => v.FilePath == path);
        if (video == null) return null;
        return video.Id.ToString();
    }

    public string? GetVideoNameByPath(string path)
    {
        Video? video = _videos.FirstOrDefault(v => v.FilePath == path);
        if (video == null) return null;
        return video.FileName;
    }

    public string? GetVideoPathById(int id)
    {
        Video? video = _videos.FirstOrDefault(v => v.Id == id);
        if (video == null) return null;
        return video.FilePath;
    }

    public string? GetVideoPathByName(string name)
    {
        var video = _videos.FirstOrDefault(v => v.FileName == name);
        if (video == null) return null;
        return video.FilePath;
    }

    public bool AddVideo(Video video)
    {
        if (video == null)
        {
            return false;
        }

        _videos.Add(video);
        return true;
    }
}