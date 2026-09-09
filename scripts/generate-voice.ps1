$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$narrationPath = Join-Path $projectRoot 'src\data\narration.json'
$outputRoot = Join-Path $projectRoot 'public\audio\voice-segments'

New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
$segments = Get-Content -LiteralPath $narrationPath -Raw | ConvertFrom-Json

$voice = New-Object -ComObject SAPI.SpVoice
$tokens = $voice.GetVoices()
for ($index = 0; $index -lt $tokens.Count; $index++) {
  $token = $tokens.Item($index)
  if ($token.GetDescription() -like 'Microsoft David Desktop*') {
    $voice.Voice = $token
    break
  }
}

$voice.Rate = 2
$voice.Volume = 100

foreach ($segment in $segments) {
  $outputPath = Join-Path $outputRoot ($segment.id + '.wav')
  if ([IO.File]::Exists($outputPath)) {
    [IO.File]::Delete($outputPath)
  }

  $stream = New-Object -ComObject SAPI.SpFileStream
  $stream.Open($outputPath, 3, $false)
  $voice.AudioOutputStream = $stream
  [void]$voice.Speak([string]$segment.text)
  $stream.Close()
}

$voice.AudioOutputStream = $null
Write-Output ("Generated {0} local SAPI narration segments with {1}." -f $segments.Count, $voice.Voice.GetDescription())
