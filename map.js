/* 강석수학 — 오시는 길 네이버 지도 (NAVER Maps JavaScript API v3)
   - Client ID 는 index.html 의 #naverMap data-ncp-key-id 에 넣는다. (Secret 은 넣지 않는다)
   - 우선순위: 네이버 지도(ID 있을 때) → 구글 지도 iframe(.map-gmap, 키 없음) → 지도 사진(.map-photo, data-photo) → 안내 카드(.map-fallback)
   - ID 가 없거나 인증 실패·네트워크 오류면 그다음 순서의 것이 보인다.
   - 지도 SDK 는 '오시는 길' 근처까지 스크롤했을 때만 불러온다(첫 화면 속도 유지). */
(() => {
  const box = document.getElementById('naverMap');
  if (!box) return;

  // 지도 사진 (구글 지도 iframe 을 뺐을 때만 사용). 사진을 못 불러오면 안내 카드가 그대로 보인다.
  const gmap = box.querySelector('.map-gmap');
  const photo = box.querySelector('.map-photo');
  const photoSrc = (box.dataset.photo || '').trim();
  if (!gmap && photo && photoSrc) {
    const img = photo.querySelector('img');
    img.loading = 'lazy';
    img.onload = () => box.classList.add('has-photo');
    if (box.dataset.photo2x) img.srcset = photoSrc + ' 1x, ' + box.dataset.photo2x.trim() + ' 2x';
    img.src = photoSrc;
  }

  const key = (box.dataset.ncpKeyId || '').trim();
  if (!key || key === 'YOUR_NCP_KEY_ID') return;   // 아직 ID 없음 → 구글 지도(없으면 사진·안내 카드) 유지

  const { address, title = '강석수학', sub = '' } = box.dataset;
  const route = document.getElementById('mapRoute');
  const card = box.querySelector('.map-fallback');
  const fail = () => {
    box.classList.remove('is-loading', 'is-ready'); box.classList.add('is-failed');
    [gmap, photo, card].forEach(el => { if (el && !box.contains(el)) box.appendChild(el); });   // 지도가 구글 지도·사진·안내 카드를 지웠으면 다시 붙인다
  };

  // 좌표를 알면 길찾기 버튼을 '도착지 = 학원' 길찾기 화면으로 바꾼다 (대중교통 기본)
  const setRoute = (lat, lng) => {
    if (route) route.href = 'https://map.naver.com/index.nhn?menu=route&pathType=1&elat=' + lat + '&elng=' + lng + '&etext=' + encodeURIComponent(title);
  };

  const draw = pos => {
    const touch = matchMedia('(pointer: coarse)').matches;
    const map = new naver.maps.Map(box, {
      center: pos, zoom: 17,
      scrollWheel: false,              // 페이지 스크롤이 지도에 걸리지 않게
      draggable: !touch,               // 휴대폰: 한 손가락은 페이지 스크롤, 두 손가락으로 확대·축소
      pinchZoom: true,
      zoomControl: true,
      zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT, style: naver.maps.ZoomControlStyle.SMALL },
      mapDataControl: false, scaleControl: false, logoControlOptions: { position: naver.maps.Position.BOTTOM_LEFT }
    });
    const label = document.createElement('div');
    label.className = 'nm-marker';
    label.innerHTML = '<span class="nm-name"></span><span class="nm-sub"></span><i></i>';
    label.querySelector('.nm-name').textContent = title;
    label.querySelector('.nm-sub').textContent = sub;
    new naver.maps.Marker({
      position: pos, map, title,
      icon: { content: label.outerHTML, anchor: new naver.maps.Point(0, 0) }
    });
    box.classList.remove('is-loading');
    box.classList.add('is-ready');
    setRoute(pos.lat(), pos.lng());
  };

  const start = () => {
    const lat = parseFloat(box.dataset.lat), lng = parseFloat(box.dataset.lng);
    if (isFinite(lat) && isFinite(lng)) return draw(new naver.maps.LatLng(lat, lng));
    if (!naver.maps.Service || !address) return fail();
    naver.maps.Service.geocode({ query: address }, (status, res) => {
      const a = status === naver.maps.Service.Status.OK && res.v2 && res.v2.addresses && res.v2.addresses[0];
      if (!a) return fail();
      console.info('[강석수학 지도] 주소로 찾은 좌표 — index.html data-lat="' + a.y + '" data-lng="' + a.x + '" 에 넣으면 주소 검색 없이 바로 표시됩니다.');
      draw(new naver.maps.LatLng(parseFloat(a.y), parseFloat(a.x)));
    });
  };

  const load = () => {
    box.classList.add('is-loading');
    window.navermap_authFailure = fail;            // ID 오류·도메인 미등록이면 네이버가 이 함수를 부른다
    window.__kmNaverMapReady = () => { try { start(); } catch (e) { fail(); } };
    const s = document.createElement('script');
    s.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=' + encodeURIComponent(key) + '&submodules=geocoder&callback=__kmNaverMapReady';
    s.async = true;
    s.onerror = fail;
    document.head.appendChild(s);
    setTimeout(() => { if (!box.classList.contains('is-ready')) fail(); }, 12000);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); load(); } }, { rootMargin: '600px 0px' });
    io.observe(box);
  } else load();
})();
