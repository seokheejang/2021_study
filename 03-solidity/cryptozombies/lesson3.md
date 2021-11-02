# lesson 3
## 컨트랙트의 불변성
솔리디티는 자바스크립트 같은 다른 언어와 비슷하게 보이지만, 이더리움 DApp의 일반 애플리케이션과는 다른 특징이 존재한다.

첫째로, 이더리움에 컨트랙트를 배포하고 나면, 컨트랙트는 변하지 않는다(Immutable). 컨트랙트 수정 및 업데이트가 불가능하다는 뜻.

컨트랙트로 배포한 최초의 코드는 항상, 블록체인에 영구적으로 존재하며 이것이 솔리디티에 있어서 보안이 굉장히 큰 이슈인 이유이다. 컨트랙트 코드에 결함이 생겨 고치고 싶을 때는 새롭게 컨트랙트를 발행하고 사용자들에게 새로 발행된 컨트랙트 주소를 사용하라고 명시해줘야 한다.

이것이 스마크 컨트랙트의 한 특징이며, 한번 정의 된 코드는 그 누구도 바꿀 수 없는 'rule'이 된다. 어떤 컨트랙트의 코드를 읽고 검증을 했다면 그 함수를 호출할 때마다 코드에 쓰여진 그대로 함수가 실행될 것이라고 확신을 가질 수 있다. 그러므로 배포 이후에는 그 누구도 함수 수정이나 예상치 못한 결과를 발생시키지 못한다.

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
* 함수 제어자(Function Modifier): modifier onlyOwner(). 제어자는 다른 함수들에 대한 접근을 제어하기 위해 사용되는 일종의 유사 함수. 보통 함수 실행 전의 요구사항 충족 여부를 확인하는 데에 사용된다. onlyOwner의 경우에는 접근을 제한해서 오직 컨트랙트의 소유자만 해당 함수를 실행할 수 있도록 하기 위해 사용될 수 있다. 다음 챕터에서 함수 제어자에 대해 더 살펴보고, _;라는 이상한 것이 뭘 하는 것인지 알아볼 것이다.
* indexed 키워드: (?)

Ownable 컨트랙트는 기본적으로 다음과 같은 것들을 한다.
1. 컨트랙트가 생성되면 컨트랙트의 생성자가 owner에 msg.sender(컨트랙트를 배포한 사람)를 대입한다.
2. 특정한 함수들에 대해서 오직 소유자만 접근할 수 있도록 제한 가능한 onlyOwner 제어자를 추가한다.
3. 새로운 소유자에게 해당 컨트랙트의 소유권을 옮길 수 있도록 한다.

onlyOwner는 컨트랙트에서 흔히 쓰는 것 중 하나라, 대부분의 솔리디티 DApp들은 Ownable 컨트랙트를 복사/붙여넣기 하면서 시작한다! 그리고 첫 컨트랙트는 이 컨트랙트를 상속해서 코드를 작성한다.

## onlyOwner 함수 제어자

## GAS

## 시간 단위

## 좀비 재사용 대기 시간

## Public 함수 & 보안

## 함수 제어자의 또 다른 특징

## 좀비 제어자

## 'View' 함수를 사용해 가스 절약하기

## Storage는 비싸다

## For 반복문