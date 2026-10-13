# My To-Do List 실행 방법

1. Node.js 22.13.0 이상이 필요합니다. 이미 설치한 v26.8.1은 그대로 사용할 수 있습니다. 설치가 필요하면 https://nodejs.org/en/download 에서 Node.js LTS의 Windows 설치 파일(.msi)을 다운로드하고 기본 옵션으로 설치합니다. npm도 함께 설치합니다.
2. 설치 후 VS Code를 다시 열고 새 PowerShell 터미널을 엽니다.
3. 다음 명령으로 설치를 확인합니다.

   ```powershell
   node --version
   npm.cmd --version
   ```

4. 프로젝트 폴더로 이동합니다.

   ```powershell
   cd "C:\Users\kimjo\Desktop\26-2\gen_ai\todo2"
   ```

5. Express를 설치합니다. package.json이 이미 있으므로 npm init은 필요 없습니다. SQLite는 Node.js 내장 모듈(node:sqlite)을 사용하므로 별도 프로그램이나 npm 패키지를 설치하지 않아도 됩니다.

   ```powershell
   npm.cmd install
   ```

6. 서버를 실행합니다.

   ```powershell
   npm.cmd start
   ```

7. 터미널을 켜 둔 채 브라우저에서 http://127.0.0.1:3000 을 엽니다.
8. 서버를 종료하려면 터미널에서 Ctrl+C를 누릅니다. 다음에 실행할 때는 프로젝트 폴더에서 npm.cmd start만 실행하면 됩니다.

PowerShell에서 실행 정책 문제를 피하도록 npm.cmd 명령을 사용합니다.

기존 화면과 디자인을 유지하며, 서버 코드(server.js)에서 SQLite 데이터베이스를 직접 관리합니다. 페이지를 열면 GET /api/todos로 저장된 목록을 받고, 추가는 POST /api/todos로 데이터베이스에 저장하며, 삭제는 DELETE /api/todos/:id로 데이터베이스에서도 삭제합니다.

첫 실행 시 프로젝트 폴더에 todos.db 파일과 todos 테이블이 자동으로 생성됩니다. 처음 목록은 비어 있습니다. 서버를 종료하거나 재시작해도 추가한 항목과 삭제 결과가 유지됩니다. todos.db 파일을 삭제하면 저장된 목록이 사라지므로 유지하세요. 기존 서버 메모리나 localStorage의 목록은 자동으로 가져오지 않습니다. HTML 파일을 직접 열지 말고 위 서버 주소로 접속하세요.

저장 확인: 할 일을 추가 → Ctrl+C로 서버 종료 → npm.cmd start로 재실행 → 브라우저 새로고침 → 목록 확인. 삭제한 항목도 같은 순서로 다시 나타나지 않는지 확인할 수 있습니다.

3000번 포트가 사용 중이라는 메시지가 나타나면 해당 포트를 사용하는 기존 서버를 종료한 뒤 다시 실행합니다.
