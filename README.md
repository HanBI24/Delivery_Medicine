# **Delivery_Medicine**

<br>

## **1. 프로젝트 개요**

현재 **의약품 배달**은 **불법**이지만, **블록체인**을 통해 **의약품 배달 서비스**를 **합법**으로 **전환하기 위한 프로젝트.**

**의약품 정보**를 가져와 **Ethereum**이라는 **가상화폐**로 **거래**하고, **의약품 내용**, **배달 정보** 등을 **블록체인**에 **저장**하여 **정보**의 **투명성**과 **불변성**을 **보장**하고, **보안성**을 **강화**시킴.   

<br>

## **2. 프로젝트 구조**

<p align="center"><img src = readme_material/expended_project_summary.png width = 1000 height = 400/></p>

- **Ethereum Geth**는 **Client**, 즉 **고객**이 **DApp**에 접속하면 **Ethereum** **가상 화폐 지갑**인 **Meta Mask**가 실행됨. **Ganache**는 **가상의 Ehereum**을 가져오기 위한 **Local Chain**.

- **의약품**은 초기 **13개**의 직접 추가한 의약품과 **공공 데이터 포털**과 **보건복지부**에서 제공하는 데이터를 사용하여 여러 개의 의약품을 추가함.  


- **고객**이 **의약품을 구매**하면 **주문 정보 입력 창**과 **결제**를 위한 **Meta Mask**가 실행됨.  


- **주문 정보 입력 창**에 **주문 정보**를 넣으면 **Firebase**의 **Cloud Storage**로 넘어가서 **관리자**가 **주문 정보**를 **관리**할 수 있음.  


- **고객**한테는 **txt** **파일**로 **주문 정보**를 받아볼 수 있음.  


- **Meta Mask**로 **최종 결제**가 진행되면 **배송 정보**가 **alert 창**으로 표시가 됨.  


- **배송 정보**는 **Solidity**로 구현한 내용을 **출력**. -> **보안성**  

## **3. 개발 환경**  

<table>
    <thead align="center">
        <tr align="center">
            <th>  </th>
            <th>Front-End</th>
            <th>Ethereum</th>
        </tr>
    </thead>
    <tbody align="center">
        <tr>
            <td><b> Development Language </b></td>
            <td>HTML<br>CSS<br>JS<br>Jquery</td>
            <td>Solidity</td>
        </tr>
        <tr>
            <td><b> Framework </b></td>
            <td colspan=4> Bootstrap </td>
        </tr>
        <tr>
            <td><b> DataBase </b></td>
            <td colspan=4>Firebase Cloud Storage</td>
        </tr>
        <tr>
            <td><b> Use API </b></td>
            <td colspan=4>Kakao Map API<br>Kakao Address API<br>공공데이터포털(보건복지부 제공)</td>
        </tr>
        <tr>
            <td><b> Management Version </b></td>
            <td colspan=4>Git</td>
        </tr>
    </tbody>
</table>
