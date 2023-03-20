@echo off
echo %cd%
start /D ".\browserSources\BRB MU and score" http-server -p 8081
start /D ".\browserSources\Starting Soon MU Timer" http-server -p 8082
start /D ".\browserSources\Starting Soon Timer" http-server -p 8083
start /D ".\browserSources\Up Next flavor and timer" http-server -p 8085

:: port 8084 doesn't work for some reason