const proc = require('child_process');

const defaultBranch = 'main';

const currentBranch = proc.execSync('git branch | grep \\* | cut -d \' \' -f2-').toString().replace('feature/', '').trim();

// 현재 작업 내역 임시로 저장
proc.execSync('git add .').toString().trim();
proc.execSync('git commit -m "temp"').toString().trim();

// remote 와 local의 기본 branch 동기화
proc.execSync(`git checkout ${defaultBranch}`).toString().trim();
proc.execSync(`git fetch origin ${defaultBranch}`).toString().trim();
proc.execSync(`git rebase origin/${defaultBranch}`).toString().trim();

// local의 기본 branch와 local의 현재 작업 중인 branch 동기화
proc.execSync(`git checkout ${currentBranch}`).toString().trim();
proc.execSync(`git rebase ${defaultBranch}`).toString().trim();

// 임시로 저장한 commit 취소 하기
proc.execSync('git reset --mixed HEAD^').toString().trim();
