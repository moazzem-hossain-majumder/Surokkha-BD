Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Female)
$synth.SetOutputToWaveFile("d:\surokkha-bd\tests\test_voice.wav")
$synth.Speak("Welcome to Surokkha BD, Bangladesh's National Disaster Resilience Platform.")
$synth.Dispose()
Write-Host "Audio generated successfully!"
