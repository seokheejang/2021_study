# Kafka example

실습하기 위해서는 kafka 시스템이 설치되어야 함

(see Configure Confluent Cloud Clients for instructions on how to manually find these values, or use the ccloud-stack Utility for Confluent Cloud to automatically create them).

* https://docs.confluent.io/cloud/current/client-apps/config-client.html
* https://docs.confluent.io/platform/current/tutorials/examples/ccloud/docs/ccloud-stack.html#ccloud-stack

이후 $HOME/.confluent/librdkafka.config 파일에 접속 정보 입력
```
# Kafka
bootstrap.servers={{ BROKER_ENDPOINT }}
security.protocol=SASL_SSL
sasl.mechanisms=PLAIN
sasl.username={{ CLUSTER_API_KEY }}
sasl.password={{ CLUSTER_API_SECRET }}
```
로컬 환경일 경우
```
# Kafka
bootstrap.servers=localhost:9092
```

윈도우 10 환경 npm 설치 에러 발생 시 파이썬 2.7을 설치해주고 아래 명령어 실행
```
npm install --global --production windows-build-tools

npm install --global node-gyp 
```

예제 코드 테스트 전 로컬 환경 세팅에 소모되는 시간이 길어질 것으로 판단돼 소스 코드만 분석