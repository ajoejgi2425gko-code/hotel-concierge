const $ = id => document.getElementById(id);
const form = $('tripForm');
const clean = (id, fallback='指定なし') => { const el=$(id); return el && el.value.trim() ? el.value.trim() : fallback; };
const checked = id => [...document.querySelectorAll(`#${id} input:checked`)].map(x=>x.value);
function updateNights(){
 const a=$('checkin').value,b=$('checkout').value; $('checkout').min=a||'';
 if(a&&b&&b<a){$('checkout').value='';$('nights').value='';$('dateHelp').textContent='チェックアウト日はチェックイン日以降を選んでください。';return;}
 if(a&&b){const [y1,m1,d1]=a.split('-').map(Number),[y2,m2,d2]=b.split('-').map(Number);const n=Math.round((Date.UTC(y2,m2-1,d2)-Date.UTC(y1,m1-1,d1))/86400000);$('nights').value=`${n}泊`; $('dateHelp').textContent=`宿泊日から${n}泊と自動計算しました。`;}
 else{$('nights').value='';$('dateHelp').textContent='宿泊日を両方選ぶと泊数を自動計算します。';}
}
$('checkin').addEventListener('change',updateNights);$('checkout').addEventListener('change',updateNights);
function buildPrompt(){
 const hotel=clean('hotel','ホテル名未入力'), location=clean('hotelLocation'), url=clean('hotelUrl'), start=clean('checkin','未定'), end=clean('checkout','未定');
 const party=`大人${clean('adults')}人、子ども${clean('children','0人')}`;
 const styles=checked('styles'), interests=checked('interests');
 const lines=[
'あなたは、宿泊施設を起点に旅行全体を組み立てる、実用的で親身な旅行コンシェルジュです。すでに予約・決定しているホテルを旅の拠点として、移動の無駄が少なく、実行しやすく満足度の高い旅行プランを日本語で提案してください。',
'', '【決定済みの宿泊情報】',
`・ホテル・宿泊施設名：${hotel}`,`・所在地：${location}`,`・公式サイト・予約ページ：${url}`,`・部屋・宿泊プラン：${clean('room')}`,
`・チェックイン：${start} ${clean('checkinTime','時刻未定')}`,`・チェックアウト：${end} ${clean('checkoutTime','時刻未定')}`,`・宿泊数：${clean('nights','未定')}`,`・ホテルで利用したい施設・サービス：${clean('hotelFacilities')}`,
'', '【旅行の条件】',`・旅行スタイル：${styles.length?styles.join('、'):'指定なし'}`,`・人数：${party}`,`・子どもの年齢：${clean('ages','該当なし・未入力')}`,`・出発地：${clean('departure')}`,`・主な移動手段：${clean('transport')}`,`・現地での移動：${clean('localTransport')}`,`・到着する駅・空港：${clean('arrivalPoint')}`,`・到着予定時刻：${clean('arrivalTime')}`,`・帰りの駅・空港／出発時刻：${clean('returnPoint')}`,
'', '【ホテル到着前・出発後】',`・チェックイン前：${clean('beforeCheckin')}`,`・チェックアウト後：${clean('afterCheckout')}`,`・荷物：${clean('luggage')}`,`・送迎・駐車場：${clean('hotelAccess')}`,`・到着・出発の補足：${clean('arrivalNotes')}`,
'', '【希望・こだわり】',`・楽しみたいこと：${interests.length?interests.join('、'):'バランスよく提案'}`,`・旅行のペース：${clean('pace')}`,`・観光範囲：${clean('range')}`,`・食事：${clean('food')}`,`・現地予算：${clean('budget')}`,`・絶対に行きたい場所・体験：${clean('mustDo','特になし')}`,`・避けたいこと・配慮事項：${clean('avoid','特になし')}`,`・その他：${clean('extra','特になし')}`,
'', '【必ず守ってほしいこと】',
`1. ${clean('research','Web検索で最新情報を確認してほしい')}。ホテルの公式サイト・予約情報・自治体や観光施設の公式情報を優先してください。`,
'2. 予約済みホテルは変更せず、そこを拠点に計画してください。ホテル名や所在地が曖昧な場合は、同名施設と取り違えず、確認が必要な点を明示してください。',
'3. チェックイン前・チェックアウト後の荷物預かり、駐車場、送迎、ホテル施設の利用可否は施設ごとに異なります。確認できない場合は利用できると断定せず「ホテルへ要確認」としてください。',
'4. 宿泊日と到着・出発時刻を軸に、初日・中日・最終日を分けて計画してください。到着前やチェックアウト後の時間も有効活用しつつ、荷物・移動・チェックイン可能時刻を考慮してください。',
'5. ホテルから各スポットへの移動時間・交通手段・駐車場・乗換を確認し、地理的に近い場所をまとめて、行ったり来たりの少ない順路にしてください。根拠のない所要時間を作らないでください。',
'6. 子どもや高齢者がいる場合は、年齢・体力に合わせ、休憩・トイレ・食事・昼寝の時間も確保してください。観光地を詰め込みすぎないでください。',
'7. 営業時間、休館日、料金、交通ダイヤ、季節営業、イベント、予約条件など変わりやすい情報は、確認日と公式情報源を示してください。確認できない情報は推測せず「要確認」としてください。',
'8. 食事はホテル内・ホテル周辺・観光ルート上から現実的な候補を提案し、予約が必要か、子ども連れで利用しやすいかも確認してください。',
'9. 雨天・荒天・施設休業・交通遅延の場合の代替案を用意してください。',
'10. 予約済みホテルを前提に、別ホテルへの宿泊変更やホテル候補探しに話を逸らさないでください。必要な場合だけ、ホテルへ確認すべき事項を整理してください。',
'', '【回答してほしい内容】',
'① 今回の旅行の楽しみ方の方針と、ホテルを拠点にするうえでのポイント',
'② 初日から最終日までの時間帯別スケジュール（時刻・場所・滞在目安・移動・荷物・休憩）',
'③ ホテル周辺と少し足を延ばす観光スポットの優先順位と、その理由',
'④ チェックイン前・チェックアウト後のおすすめの過ごし方と荷物の対応',
'⑤ 食事・カフェ・休憩場所の候補と選び方',
'⑥ ホテルの施設・サービスを旅行中に活用する方法',
'⑦ 雨天・混雑・休業・予定変更時の代替プラン',
'⑧ 予約・事前確認・持ち物など、出発前に準備すること',
'⑨ 参照した公式情報のリンク、確認日、確認できなかった事項',
'',`回答の詳しさ：${clean('detail','詳しく')}。`,
'最初に結論を簡潔に示し、その後に日程別のスケジュールを表形式でまとめてください。時刻は到着・出発条件から無理なく設定し、未入力情報を勝手に確定せず、仮定と確認事項を分けてください。'
 ]; return lines.join('\n');
}
form.addEventListener('submit',e=>{e.preventDefault();$('promptOutput').value=buildPrompt();$('result').classList.remove('hidden');$('copyStatus').textContent='';$('result').scrollIntoView({behavior:'smooth',block:'start'});});
$('copyButton').addEventListener('click',async()=>{const t=$('promptOutput').value;try{await navigator.clipboard.writeText(t);$('copyStatus').textContent='コピーしました。AIの入力欄に貼り付けてください。';}catch{$('promptOutput').focus();$('promptOutput').select();const ok=document.execCommand('copy');$('copyStatus').textContent=ok?'コピーしました。':'文章を選択しました。コピーしてください。';}});
$('shareButton').addEventListener('click',async()=>{const text=$('promptOutput').value;if(navigator.share){try{await navigator.share({title:'ホテル決定後の旅行プラン相談',text});}catch(e){if(e.name!=='AbortError')$('copyStatus').textContent='共有できませんでした。コピーをご利用ください。';}}else{try{await navigator.clipboard.writeText(text);$('copyStatus').textContent='共有機能がないため、文章をコピーしました。';}catch{$('copyStatus').textContent='コピー機能をご利用ください。';}}});
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
