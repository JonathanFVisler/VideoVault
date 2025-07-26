public interface IVideoService
{
    IEnumerable<string> GetAllVideoPaths();
    IEnumerable<Video> GetAllVideoDetails();
    Video? GetVideoByPath(string path);
    Video? GetVideoById(int id);
    string? GetVideoDetailsByPath(string path);
    string? GetVideoPathById(int id);
    string? GetVideoPathByName(string name);
    string? GetVideoIdByPath(string path);
    string? GetVideoNameByPath(string path);
    bool AddVideo(Video video);
}