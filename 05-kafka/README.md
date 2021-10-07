# Kafka
Kafka는 Pub-Sub 모델의 Message Queue이다. 분산 환경에 특화되어있는 특징을 가지고 있다.

## 구성요소
### Event
Producer와 Consumer가 데이터를 주고 받는 단위, 이벤트 또는 메시지의 의미
### Producer
이벤트를 게시(post)하는 client app을 의미
### Consumer
Topic을 구독하고 이로부터 얻어낸 이벤트를 처리하는 client app
### Topic
이벤트가 쓰이는 곳. Producer는 Topic에 이벤트를 게시하고, Consumer는 Topic으로부터 이벤트를 가져와 처리한다.

Topic은 파일시스템의 폴더와 유사하며, 이벤트는 폴더안의 파일과 유사
### Broker
일반적으로 kafka 시스템 자체를 의미하며, Kafka Server라고 불린다. Producer가 생성한 메시지를 받아 Offset을 관리하고 Consumer로부터 메시지를 읽으려는 요청에 대한 응답을 한다. Broker는 클러스터링 시스템이며 최소 3개 이상을 만들 것을 권장한다.
### Partition
Topic은 여러 Broker에 분산 저장되며, 이렇게 저장된 Topic을 Partition이라 부른다. 어떤 이벤트가 Partition에 저장될지는 이벤트의 Key에 의해 정해지며, 같은 key를 가지는 이벤트는 항상 같은 Partition에 저장된다.

Kafka는 Topic의 Partition에 지정된 Consumer가 항상 정확히 동일한 순서로 Partition의 이벤트를 읽을 것을 보장한다.

## Kafka 주요 개념
### Push와 Pull 모델
Consumer는 Pull 모델을 기반으로 메시지 처리를 진행한다. Broker가 Consumer에게 메시지를 전달하는 것이 아닌, Consumer가 필요할 때, Broker로부터 메시지를 가져와 처리하는 형태이다.

## 소비된 메시지 추적(Commit과 Offset)
### Offset
메시지는 지정된 Topic에 전달된다. Topic은 다시 여러 Partition으로 나뉠 수 있으며, 메시지는 로그에 순차적으로 append 된다. 그리고 이 메시지의 상대적인 위치를 offset이라고 칭한다.
### Commit과 Offset
Consumer의 poll()은 이전에 commit한 offset이 존재하면, 해당 offset 이후의 메시지를 읽어오게 된다. 읽어온 뒤 마지막 offset을 commit 한다. 이어서 poll()이 실행되면 방금 전 commit한 offset 이후의 메시지를 읽어와 처리하게 된다.
### 메시지(이벤트) 전달 컨셉
* At most once(최대 한번) : 메시지가 손실될 수 있지만, 재전달은 하지 않음
* At least once(최소 한번) : 메시지가 손실되지 않지만, 재전달이 일어남
* Exactly once(정확히 한번) : 메시지가 정확히 한 번 전달 됨