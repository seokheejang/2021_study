# lesson 3
## 컨트랙트의 불변성
솔리디티는 자바스크립트 같은 다른 언어와 비슷하게 보이지만, 이더리움 DApp의 일반 애플리케이션과는 다른 특징이 존재한다.

첫째로, 이더리움에 컨트랙트를 배포하고 나면, 컨트랙트는 변하지 않는다(Immutable). 컨트랙트 수정 및 업데이트가 불가능하다는 뜻.

컨트랙트로 배포한 최초의 코드는 항상, 블록체인에 영구적으로 존재하며 이것이 솔리디티에 있어서 보안이 굉장히 큰 이슈인 이유이다. 컨트랙트 코드에 결함이 생겨 고치고 싶을 때는 새롭게 컨트랙트를 발행하고 사용자들에게 새로 발행된 컨트랙트 주소를 사용하라고 명시해줘야 한다.

이것이 스마트 컨트랙트의 한 특징이며, 한번 정의된 코드는 그 누구도 바꿀 수 없는 'Rule'이 된다. 어떤 컨트랙트의 코드를 읽고 검증을 했다면 그 함수를 호출할 때마다 코드에 쓰여진 그대로 함수가 실행될 것이라고 확신을 가질 수 있다. 그러므로 배포 이후에는 그 누구도 함수 수정이나 예상치 못한 결과를 발생시키지 못한다.

## 외부 의존성
배포된 코드를 변경할 수는 없지만 일부 입력받는 값들은 변경이 가능하다. 예를 들면 DApp에 컨트랙트 주소를 직접 작성하는 대신에 set함수를 만들어 해당 주소를 바꿀 수 있다.
```js
// 변경 전
  address ckAddress = 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d;
  KittyInterface kittyContract = KittyInterface(ckAddress);
```
```js
// 변경 후
  KittyInterface kittyContract;
  function setKittyContractAddress(address _address) external {
    kittyContract = KittyInterface(_address);
  }
```
> 취약점: 위 함수는 external 이라 누구든 외부에서 이 함수를 호출할 수 있다.

## 소유 가능한 컨트랙트
위 경우에 대처하기 위해서, 최근에 주로 쓰는 하나의 방법은 컨트랙트를 소유 가능하게 만드는 것이다. 컨트랙트를 대상으로 특별한 권리를 가지는 소유자(owner)가 있음을 의미.
### OpenZeppelin의 Ownable 컨트랙트
아래 코드는 OpenZeppelin 라이브러리에서 가져온 Ownable 컨트랙트이다.
```js
/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}
```
* 생성자(Constructor): function Ownable()는 생성자이다. 컨트랙트와 동일한 이름을 가진, 생략할 수 있는 특별한 함수. 이 함수는 컨트랙트가 생성될 때 딱 한 번만 실행된다.
* 함수 제어자(Function Modifier): modifier onlyOwner(). 제어자는 다른 함수들에 대한 접근을 제어하기 위해 사용되는 일종의 유사 함수. 보통 함수 실행 전의 요구사항 충족 여부를 확인하는 데에 사용된다. onlyOwner의 경우에는 접근을 제한해서 오직 컨트랙트의 소유자만 해당 함수를 실행할 수 있도록 하기 위해 사용될 수 있다. 계속해서 함수 제어자와 _;라는 것이 뭘 하는 것인지 알아볼 예정.
* indexed 키워드: (?)

Ownable 컨트랙트는 기본적으로 다음과 같은 행동을 한다.
1. 컨트랙트가 생성되면 컨트랙트의 생성자가 owner에 msg.sender(컨트랙트를 배포한 사람)를 대입한다.
2. 특정한 함수들에 대해서 오직 소유자만 접근할 수 있도록 제한 가능한 onlyOwner 제어자를 추가한다.
3. 새로운 소유자에게 해당 컨트랙트의 소유권을 옮길 수 있도록 한다.

onlyOwner는 컨트랙트에서 흔히 쓰는 것 중 하나라, 대부분의 솔리디티 DApp들은 Ownable 컨트랙트를 복사/붙여넣기 하면서 시작한다. 그리고 첫 컨트랙트는 이 컨트랙트를 상속해서 코드를 작성한다.

## onlyOwner 함수 제어자
기본 컨트랙트인 ZombieFactory가 Ownable을 상속하고 있으니, onlyOwner 함수 제어자를 ZombieFeeding에서도 사용할 수 있다.
```js
ZombieFeeding is ZombieFactory
ZombieFactory is Ownable
```
ZombieFeeding 또한 Ownable이고, Ownable 컨트랙트의 함수/이벤트/제어자에 접근할 수 있다. 이건 향후에 ZombieFeeding을 상속하는 다른 컨트랙트들에도 마찬가지로 적용된다.
### 함수 제어자
함수 제어자는 함수처럼 보이지만, function 키워드 대신 modifier 키워드를 사용한다. 함수 제어자는 함수를 호출하듯이 직접 호출할 수는 없다. 대신에 함수 정의부 끝에 해당 함수의 작동 방식을 바꾸도록 제어자의 이름을 붙일 수 있다.
```js
/**
 * @dev Throws if called by any account other than the owner.
 */
modifier onlyOwner() {
  require(msg.sender == owner);
  _; // 이 부분 !
}
```
```js
contract MyContract is Ownable {
  event LaughManiacally(string laughter);

  // 아래 `onlyOwner`의 사용 방법을 잘 보면...
  function likeABoss() external onlyOwner {
    LaughManiacally("Muahahahaha");
  }
}
```
likeABoss 함수를 호출하면, onlyOwner의 코드가 먼저 실행되고 onlyOwner의 _; 부분을 likeABoss 함수로 되돌아가게 해 기존 코드를 실행하게 한다.

제어자를 사용할 수 있는 다양한 방법이 있지만, 가장 일반적으로 쓰는 예시 중 하나는 함수 실행 전에 require 체크를 넣는 것이 있다.
> 참고: 이렇게 소유자가 컨트랙트에 특별한 권한을 갖도록 하는 것은 자주 필요하지만, 악용될 가능성도 있다. 예를 들어, 소유자가 다른 사람의 좀비를 뺏어올 수 있도록 하는 백도어 함수를 추가할 수도 있다.


> 이더리움에서 돌아가는 DApp이라고 해서 그것만으로 분산화되어 있다고 할 수는 없다. 반드시 전체 소스 코드를 읽어보고, 잠재적으로 걱정할 만한, 소유자에 의한 특별한 제어가 불가능한 상태인지 확인해야 한다. 개발자로서는 잠재적인 버그를 수정하고 DApp을 안정적으로 유지하도록 하는 것과, 사용자들이 그들의 데이터를 믿고 저장할 수 있는 소유자가 없는 플랫폼을 만드는 것 사이에서 균형을 잘 잡는 것이 중요하다.

## GAS
### 가스 - 이더리움 DApp이 사용하는 연료
솔리디티에서는 사용자들이 DApp의 함수를 실행할 때마다 _가스_라고 불리는 화폐를 지불해야 한다. 사용자는 이더(ETH, 이더리움의 화폐)를 이용해서 가스를 사기 때문에, DApp 함수를 실행하려면 사용자들은 ETH를 소모해야만 한다.

함수를 실행하는 데에 얼마나 많은 가스가 필요한지는 그 함수의 로직(논리 구조)이 얼마나 복잡한지에 따라 달라지며, 각각의 연산은 소모되는 가스 비용(gas cost)이 있다. 그 연산을 수행하는 데에 소모되는 컴퓨팅 자원의 양이 이 비용을 결정한다. 예를 들어, storage에 값을 쓰는 것은 두 개의 정수를 더하는 것보다 훨씬 비용이 높다. 전체 가스 비용은 그 함수를 구성하는 개별 연산들의 가스 비용을 모두 합친 것과 같다.

함수를 실행하는 것은 사용자들에게 실제 돈을 쓰게 하기 때문에, 이더리움에서 코드 최적화는 다른 프로그래밍 언어들에 비해 훨씬 더 중요하다. 만약 코드가 엉망이라면, 사용자들은 함수를 실행하기 위해 일종의 할증료를 더 내야 할 것이며, 수천 명의 사용자가 이런 불필요한 비용을 낸다면 할증료가 수십 억 원까지 쌓일 수 있다.

### 가스는 왜 필요한가?
이더리움은 크고 느린, 하지만 굉장히 안전한 컴퓨터와 같다고 할 수 있다. 어떤 함수를 실행할 때, 네트워크상의 모든 개별 노드가 함수의 출력값을 검증하기 위해 그 함수를 실행해야 한다. 모든 함수의 실행을 검증하는 수천 개의 노드가 바로 이더리움을 분산화하고, 데이터를 보존하며 누군가 검열할 수 없도록 하는 요소이다.

이더리움을 만든 사람들은 누군가가 무한 반복문을 써서 네트워크를 방해하거나, 자원 소모가 큰 연산을 써서 네트워크 자원을 모두 사용하지 못하도록 설계했다. 그래서 연산 처리에 비용이 들도록 만들었고, 사용자들은 저장 공간 뿐만 아니라 연산 사용 시간에 따라서도 비용을 지불해야 한다.

### 가스를 아끼기 위한 구조체 압축
레슨 1에서, uint에 다른 타입들이 있다는 것을 배웠다. uint8, uint16, uint32, 기타 등등..

기본적으로는 이런 하위 타입들을 쓰는 것은 아무런 이득이 없다. 왜냐하면 솔리디티에서는 uint의 크기에 상관없이 256비트의 저장 공간을 미리 잡아놓기 때문. 예를 들자면, uint(uint256) 대신에 uint8을 쓰는 것은 가스 소모를 줄이는 데에 아무 영향이 없다.

하지만 struct의 안에서는 예외가 존재

구조체 안에 여러 개의 uint를 만든다면, 가능한 더 작은 크기의 uint를 쓰도록 하자. 솔리디티에서 그 변수들을 더 적은 공간을 차지하도록 압축할 것이다.
```js
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini`는 구조체 압축을 했기 때문에 `normal`보다 가스를 조금 사용할 것으로 예상
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30); 
```
이런 이유로, 구조체 안에서는 가능한 한 작은 크기의 정수 타입을 쓰는 것이 좋다.

또한 동일한 데이터 타입은 하나로 묶어놓는 것이 좋다. 즉, 구조체에서 서로 옆에 있도록 선언하면 솔리디티에서 사용하는 저장 공간을 최소화한다. 예를 들면, uint c; uint32 a; uint32 b;라는 필드로 구성된 구조체가 uint32 a; uint c; uint32 b; 필드로 구성된 구조체보다 가스를 덜 소모한다. uint32 필드가 묶여있기 때문에.

```js
struct Zombie {
    string name;
    uint dna;
    uint32 level;
    uint32 readyTime;
}
// 레벨과 시간 데이터(Timestamp)를 저장하는 데에는 충분하고도 남는 크기이니, 이렇게 하면 보통의 uint(256비트)를 쓰는 것보다 데이터를 더 압축해서 가스 비용이 줄어든다.
```
## 시간 단위
### 시간 단위(Time units)
솔리디티는 시간을 다룰 수 있는 단위계를 기본적으로 제공

now 변수를 쓰면 현재의 유닉스 타임스탬프(1970년 1월 1일부터 지금까지의 초 단위 합) 값을 얻을 수 있다.
> 참고: 유닉스 타임은 전통적으로 32비트 숫자로 저장된다. 이는 유닉스 타임스탬프 값이 32비트로 표시가 되지 않을 만큼 커졌을 때 많은 구형 시스템에 문제가 발생할 "Year 2038" 문제를 일으킬 것이다. 그러니 만약 우리 DApp이 지금부터 20년 이상 운영되길 원한다면, 우리는 64비트 숫자를 써야 할 것이다. 하지만 우리 유저들은 그동안 더 많은 가스를 소모해야하니. 정확한 설계와 결정이 필요!

솔리디티는 또한 seconds, minutes, hours, days, weeks, years 같은 시간 단위 또한 포함하고 있다. 그에 해당하는 길이 만큼의 초 단위 uint 숫자로 변환된다. 즉 1 minutes는 60, 1 hours는 3600(60초 x 60 분), 1 days는 86400(24시간 x 60분 x 60초) 같이 변환된다.
```js
uint lastUpdated;

// `lastUpdated`를 `now`로 설정
function updateTimestamp() public {
  lastUpdated = now;
}

// 마지막으로 `updateTimestamp`가 호출된 뒤 5분이 지났으면 `true`를, 5분이 아직 지나지 않았으면 `false`를 반환
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```
## 좀비 재사용 대기 시간

## Public 함수 & 보안

## 함수 제어자의 또 다른 특징

## 좀비 제어자

## 'View' 함수를 사용해 가스 절약하기

## Storage는 비싸다

## For 반복문