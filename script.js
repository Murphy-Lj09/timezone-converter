const { DateTime } = luxon;

// 常用时区
const commonTimeZones = [
  { tz: "America/Los_Angeles", label: "Pacific Time (洛杉矶, 西雅图)" },
  { tz: "America/New_York", label: "Eastern Time (纽约, 华盛顿)" },
  { tz: "Europe/London", label: "London Time (伦敦)" },
  { tz: "Europe/Paris", label: "Central Europe Time (巴黎, 柏林)" },
  { tz: "Asia/Shanghai", label: "China Standard Time (北京, 上海)" },
  { tz: "Asia/Tokyo", label: "Japan Standard Time (东京)" },
  { tz: "Australia/Sydney", label: "Sydney Time (悉尼)" }
];
const allTimeZones = Intl.supportedValuesOf("timeZone");

function populateTimeZones(select) {
  commonTimeZones.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.tz;
    opt.textContent = "⭐ " + item.label;
    select.appendChild(opt);
  });
  const sep = document.createElement("option");
  sep.disabled = true;
  sep.textContent = "------------------";
  select.appendChild(sep);
  allTimeZones
    .filter(tz => !commonTimeZones.some(c => c.tz === tz))
    .forEach(tz => {
      const opt = document.createElement("option");
      opt.value = tz;
      opt.textContent = tz;
      select.appendChild(opt);
    });
}

populateTimeZones(document.getElementById("interviewerTZ"));
populateTimeZones(document.getElementById("candidateTZ"));

document.getElementById("interviewerTZ").value = Intl.DateTimeFormat().resolvedOptions().timeZone;
document.getElementById("candidateTZ").value = Intl.DateTimeFormat().resolvedOptions().timeZone;

function setNow() {
  const now = DateTime.now().toFormat("yyyy-LL-dd'T'HH:mm");
  document.getElementById("interviewTime").value = now;
}
setNow();
document.getElementById("nowBtn").addEventListener("click", setNow);

let lastConverted = null;

// 合并事件监听 + 淡入动画
document.getElementById("convertBtn").addEventListener("click", () => {
  const interviewTime = document.getElementById("interviewTime").value;
  const interviewerTZ = document.getElementById("interviewerTZ").value;
  const candidateTZ = document.getElementById("candidateTZ").value;

  if (!interviewTime) {
    alert("请输入面试时间");
    return;
  }

  const dt = DateTime.fromISO(interviewTime, { zone: interviewerTZ });
  const candidateTime = dt.setZone(candidateTZ);

  const diffHours = (candidateTime.offset - dt.offset) / 60;
  const diffText = diffHours === 0 
    ? "两地时间相同"
    : `目标时区比原时区 ${diffHours > 0 ? "快" : "慢"} ${Math.abs(diffHours)} 小时`;

  document.getElementById("result").innerHTML = `
    <div class="main-time">面试者本地时间: ${candidateTime.toFormat("yyyy-MM-dd HH:mm")}</div>
    <div class="time-diff">${diffText}</div>
  `;
  document.getElementById("result").classList.add("show");

  lastConverted = { start: candidateTime, summary: "面试提醒" };

  document.getElementById("downloadICS").classList.remove("hidden");
  document.getElementById("copyBtn").classList.remove("hidden");
});

// 下载 ICS
document.getElementById("downloadICS").addEventListener("click", () => {
  if (!lastConverted) {
    alert("请先转换时间");
    return;
  }

  advancedModal.style.display = "flex";
});


document.getElementById("download").addEventListener("click", () => {
  console.log("开始下载 ICS 文件"); 
  const duration = parseInt(document.getElementById("duration").value) || 30;
  const dtStart = lastConverted.start.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const dtEnd = lastConverted.start.plus({ minutes: duration }).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const description = document.getElementById("description").value || "跨时区面试提醒";
  const calName = document.getElementById("calname").value || "跨时区面试日历";
  const summary = document.getElementById("summary").value || "面试提醒";

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
X-WR-CALNAME:${calName}
X-WR-TIMEZONE:${document.getElementById("candidateTZ").value}
BEGIN:VEVENT
DTSTART:${dtStart}
DTEND:${dtEnd}
DESCRIPTION:${description}
SUMMARY:${summary}
END:VEVENT
END:VCALENDAR
  `.trim();

  const blob = new Blob([icsContent], { type: "text/calendar" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "面试提醒.ics";
  link.click();
});


// 修复版一键复制
document.getElementById("copyBtn").addEventListener("click", () => {
  if (!lastConverted) {
    alert("请先转换时间");
    return;
  }
  
  const copyText = `面试者本地时间: ${lastConverted.start.toFormat("yyyy-MM-dd HH:mm")}（面试提醒）`;
  
  navigator.clipboard.writeText(copyText).then(() => {
    alert("已复制到剪贴板");
  }).catch(err => {
    console.error("复制失败:", err);
    alert("复制失败，请手动选择文字");
  });
});

// 弹窗交互
const creditBox = document.getElementById("creditBox");
const popupBox = document.getElementById("popupBox");

creditBox.addEventListener("click", (e) => {
  e.stopPropagation();
  popupBox.style.display = "block";
  setTimeout(() => {
    popupBox.style.display = "none";
  }, 4000);
});

// 点击外部关闭
document.addEventListener("click", () => {
  popupBox.style.display = "none";
});

// 高级选项模态框
const advancedModal = document.getElementById("advancedModal");
const closeAdvanced = document.getElementById("closeAdvanced");

closeAdvanced.addEventListener("click", () => {
  advancedModal.style.display = "none";
});

// 点击模态框背景关闭
advancedModal.addEventListener("click", (e) => {
  if (e.target === advancedModal) {
    advancedModal.style.display = "none";
  }
});

// ESC键关闭模态框
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    advancedModal.style.display = "none";
  }
});
