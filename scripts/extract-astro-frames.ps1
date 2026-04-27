$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$ffmpeg = 'C:\Users\apirr\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffmpeg.exe'
$ffprobe = 'C:\Users\apirr\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffprobe.exe'
$source = 'C:\Users\apirr\OneDrive\Desktop\August (HardDrive)\Digital Media Design\personal projects\Astro Fools Hopper IPA ad\Video\portfoilo scroll .mp4'
$framesDir = Join-Path $projectRoot 'public\media\astro-fools-hopper\frames'
$poster = Join-Path $projectRoot 'public\media\astro-fools-hopper\poster.webp'
$fps = 18

if (!(Test-Path $ffmpeg)) {
  throw "ffmpeg not found at $ffmpeg"
}

if (!(Test-Path $ffprobe)) {
  throw "ffprobe not found at $ffprobe"
}

if (!(Test-Path $source)) {
  throw "Source video not found at $source"
}

New-Item -ItemType Directory -Force -Path $framesDir | Out-Null
Remove-Item -Path (Join-Path $framesDir '*.webp') -Force -ErrorAction SilentlyContinue

$duration = & $ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $source
$durationNumber = [math]::Round([double]$duration, 3)

& $ffmpeg -y -i $source -vf "fps=$fps,scale=1280:-1:flags=lanczos" -c:v libwebp -quality 82 -compression_level 6 (Join-Path $framesDir 'frame-%04d.webp')
& $ffmpeg -y -i $source -vf "select=eq(n\,1),scale=1280:-1:flags=lanczos" -vframes 1 -c:v libwebp -quality 88 $poster

$frameCount = (Get-ChildItem $framesDir -Filter '*.webp' | Measure-Object).Count

Write-Host "Astro frames extracted."
Write-Host "Duration: $durationNumber seconds"
Write-Host "FPS: $fps"
Write-Host "Frames: $frameCount"
Write-Host "Frames directory: $framesDir"
Write-Host "Poster: $poster"
