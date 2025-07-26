using System.ComponentModel;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using NReco.VideoConverter;

[ApiController]
[Route("api/[controller]")]
public class VideosController : ControllerBase
{
    private readonly IVideoService _videoService;

    public VideosController(IVideoService videoService)
    {
        _videoService = videoService;
    }

    [HttpGet]
    public IActionResult GetAllVideoDetails()
    {
        var videos = _videoService.GetAllVideoDetails();
        return Ok(videos);
    }

    [HttpGet("{filePath}")]
    public IActionResult GetVideoByPath(string filePath)
    {
        var video = _videoService.GetVideoByPath(filePath);
        if (video == null)
        {
            return NotFound();
        }
        return Ok(video);
    }

    [HttpGet("random/{count}")]
    public IActionResult GetRandomVideos(int count)
    {
        var allVideos = _videoService.GetAllVideoDetails().ToList();
        if (count > allVideos.Count)
        {
            count = allVideos.Count;
        }

        var randomVideos = allVideos.OrderBy(v => Guid.NewGuid()).Take(count);
        return Ok(randomVideos);
    }

    [HttpGet("search/{query}/{maxResults}")]
    public IActionResult GetVideoSearch(string query, int maxResults = 20)
    {
        List<Video> allVideos = _videoService.GetAllVideoDetails().ToList();
        List<Video> filteredVideos = allVideos.Where(v => v.FileName.Contains(query, StringComparison.OrdinalIgnoreCase)).Take(maxResults).ToList();
        Console.WriteLine($"Filtered {filteredVideos.Count} videos matching query '{query}'");
        if (filteredVideos.Count < maxResults)
        {
            int remainingCount = maxResults - filteredVideos.Count;
            List<Video> remainingVideos = allVideos.Except(filteredVideos).ToList();
            List<Video> sortedVideos = remainingVideos.OrderBy(v => Util.LevenshteinDistance(v.FileName, query)).Take(remainingCount).ToList();
            filteredVideos.AddRange(sortedVideos);
        }
        Console.WriteLine($"Returning {filteredVideos.Count} videos after applying maxResults limit of {maxResults}");

        return Ok(filteredVideos);
    }

    [HttpPost]
    public async Task<IActionResult> UploadVideo(IFormFile file, [FromForm] string displayName, [FromForm] string creator, [FromForm] string duration)
    {
        Console.WriteLine("UploadVideo called with file: " + file?.FileName + ", displayName: " + displayName + ", creator: " + creator + ", duration: " + duration);

        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        // Parse duration (in seconds) into TimeSpan
        if (!double.TryParse(duration, out var durationSeconds))
        {
            return BadRequest("Invalid duration format");
        }

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Videos");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var filePath = Path.Combine(uploadsFolder, Path.GetFileName(file.FileName));

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }


        string thumbnailPath = SaveThumbnail(file.FileName, filePath);

        TimeSpan durationTimeSpan = TimeSpan.FromSeconds(durationSeconds);
        filePath = "/Videos/" + Path.GetFileName(file.FileName);
        SaveVideoToDatabase(filePath, displayName, creator, durationTimeSpan, thumbnailPath);

        Console.WriteLine("Video uploaded successfully: " + filePath);

        return Ok(new
        {
            message = "UploadVideo complete",
            filePath = $"/uploads/{file.FileName}",
            displayName,
            creator,
            duration = durationTimeSpan.ToString(@"hh\:mm\:ss")
        });
    }

    private void SaveVideoToDatabase(string filePath, string displayName, string creator, TimeSpan duration, string thumbnailPath)
    {
        var video = new Video
        {
            FilePath = filePath,
            FileName = Path.GetFileName(filePath),
            Creator = creator,
            Duration = duration,
            ThumbnailPath = "/thumbnails/" + Path.GetFileName(thumbnailPath)
        };

        _videoService.AddVideo(video);
    }

    private string SaveThumbnail(string fileName, string filePath)
    {
        string thumbnailFolder = Path.Combine(Directory.GetCurrentDirectory(), "Thumbnails");
        if (!Directory.Exists(thumbnailFolder))
        {
            Directory.CreateDirectory(thumbnailFolder);
        }

        string thumbnailPath = Path.Combine(thumbnailFolder, Path.GetFileNameWithoutExtension(fileName) + ".jpg");

        var ffMpeg = new FFMpegConverter();
        ffMpeg.GetVideoThumbnail(filePath, thumbnailPath,5);

        return thumbnailPath;
    }
}