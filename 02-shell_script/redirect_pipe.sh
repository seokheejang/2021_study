#!/bin/bash

### Concept ###
# Redirect : 프로그램의 결과나 출력을 파일이나 스트림으로 전달함
# Pipe     : 프로세스 혹은 실행된 프로그램의 결과를 프로그램으로 넘겨줌
# Redirect, Pipe는 IPC(Interprocess Communication)에 속함

### Linux Command ###
# tee : 표준 입력(standard input)에서 읽어서 표준 출력(standard output)과 파일에 쓰는 명령어


echo "redirect" | tee output.txt
echo "redirect" | tee -a output.txt
echo "redirect" 2>&1 output.txt
echo "redirect" 1> output.txt 2> output_err.txt

/dev/null 2>&1