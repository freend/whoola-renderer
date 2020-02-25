# hoolaMoolah Rendering Server

- 현재 구성은 도커로 되어 있으며 오픈 포트는 3000번이다.
- 80번으로 들어온 nginx container에 다음과 같은 명령을 변경해 준다

```shell
# 이 파일을 찾는다
/etc/nginx/sites-available/default
```

