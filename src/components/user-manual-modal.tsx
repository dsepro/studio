
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export function UserManualModal({ isOpen, onClose, language }: UserManualModalProps) {
  if (!isOpen) return null;

  const T = {
    modalTitle: language === 'zh-hk' ? '用戶手冊' : 'User Manual',
    modalDescription: language === 'zh-hk' ? '歡迎使用考試資訊板。這是一個快速指南：' : "Welcome to the Exam Info Board. Here's a quick guide:",
    overviewTitle: language === 'zh-hk' ? '概覽' : 'Overview',
    overviewText: language === 'zh-hk' ? '此應用程式可幫助您記錄考試詳細資訊並在考試期間有效管理時間。' : 'This application helps you keep track of exam details and manage your time effectively during an exam.',
    headerBarTitle: language === 'zh-hk' ? '頂部導覽列' : 'Header Bar',
    headerBarItems: [
      language === 'zh-hk' ? '<strong>時鐘:</strong> 顯示目前系統時間。' : '<strong>Clock:</strong> Displays the current system time.',
      language === 'zh-hk' ? '<strong>字型大小調整 (+/- 圖示):</strong> 點擊增大或減小按鈕來調整應用的基礎字型大小。' : '<strong>Font Size (+/- icons):</strong> Click the increase or decrease buttons to adjust the application\'s base font size.',
      language === 'zh-hk' ? '<strong>主題切換 (太陽/月亮圖示):</strong> 在淺色和深色主題之間切換。' : '<strong>Theme Toggle (Sun/Moon icon):</strong> Toggles between light and dark themes.',
      language === 'zh-hk' ? '<strong>考試設定 (設定圖示):</strong> 開啟考試配置模式。您可以手動輸入中心資訊、考試科目、試卷、時長、考試時間及試卷語言。' : '<strong>Exam Setup (Settings icon):</strong> Opens the exam configuration modal. You can manually enter centre information, exam subject, paper, duration, exam times, and exam language.',
      language === 'zh-hk' ? '<strong>語言切換 (繁/EN 圖示):</strong> 切換顯示語言 (繁體中文（香港）/英文)。' : '<strong>Language Toggle (繁/EN icon):</strong> Toggle display language (Traditional Chinese (Hong Kong)/English).',
      language === 'zh-hk' ? '<strong>全螢幕切換 (展開/收縮圖示):</strong> 進入或退出全螢幕模式。' : '<strong>Fullscreen Toggle (Expand/Shrink icon):</strong> Enter or exit fullscreen mode.',
      language === 'zh-hk' ? '<strong>用戶手冊 (書本圖示):</strong> 開啟此指南。' : '<strong>User Manual (Book icon):</strong> Opens this guide.',
      // Item for Install App / PWA removed
    ],
    examInfoCardTitle: language === 'zh-hk' ? '考試資訊卡片' : 'Exam Information Card',
    examInfoCardText: language === 'zh-hk' ? '顯示目前配置的考試詳細資訊，例如考試名稱、中心、科目、試卷、時長等。這些資訊可以透過「考試設定」進行配置。' : 'Displays details about the current configured exam, such as title, centre, subject, paper, duration, etc. These can be configured via "Exam Setup".',
    timerCardTitle: language === 'zh-hk' ? '考試計時器卡片' : 'Exam Timer Card',
    timerCardItems: [
      language === 'zh-hk' ? '<strong>計時器顯示:</strong> 以 HH:MM:SS 格式顯示剩餘時間。剩餘時間少於或等於5分鐘時變為紅色。如果計時器未運行，您可以點擊時間顯示打開編輯彈窗來修改剩餘時間。' : '<strong>Timer Display:</strong> Shows remaining time in HH:MM:SS format. Turns red when 5 minutes or less remain. If the timer is not running, you can click the time display to open an edit modal to modify the time.',
      language === 'zh-hk' ? '<strong> +/- 按鈕:</strong> 在時間顯示旁邊，用於快速增加或減少1分鐘。這些按鈕在計時器停止時可用。' : '<strong> +/- Buttons:</strong> Next to the time display for quick +/- 1 minute adjustments. These are available when the timer is stopped.',
      language === 'zh-hk' ? '<strong>開始/停止/重設:</strong> 控制計時器。重設操作是即時的。' : '<strong>Start/Stop/Reset:</strong> Control the timer. Reset is immediate.',
    ],
    dataPersistenceTitle: language === 'zh-hk' ? '資料持久化' : 'Data Persistence',
    dataPersistenceText: language === 'zh-hk' ? '計時器設定（初始時長、目前剩餘時間、運行狀態）、考試詳細資訊和應用程式語言偏好都儲存在瀏覽器的本機儲存空間中。這表示即使您關閉瀏覽器分頁或重新整理頁面，您的設定也將保留。' : 'Timer settings (initial duration, current time left, running state), exam details, and app language preference are saved in your browser\'s local storage. This means your settings will persist even if you close the browser tab or refresh the page.',
    tipsTitle: language === 'zh-hk' ? '提示' : 'Tips',
    tipsItems: [
      language === 'zh-hk' ? '使用全螢幕模式以獲得無干擾的環境。' : 'Use fullscreen mode for a distraction-free environment.',
      language === 'zh-hk' ? '使用 +/- 按鈕調整字型大小以獲得舒適的閱讀體驗。' : 'Use the +/- buttons to adjust font size for comfort.',
      language === 'zh-hk' ? '在開始前透過「考試設定」設定好考試詳細資訊。' : 'Set up exam details via "Exam Setup" before starting.',
      language === 'zh-hk' ? '如果計時器未運行，可以點擊時間顯示（打開編輯彈窗）或使用 +/- 按鈕來修改剩餘時間。' : 'Modify the remaining time by clicking on the time display (to open a modal) or using the +/- buttons if the timer isn\'t running.',
    ],
    closeButton: language === 'zh-hk' ? '關閉' : 'Close',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{T.modalTitle}</DialogTitle>
          <DialogDescription>
            {T.modalDescription}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] p-1 pr-4">
          <div className="space-y-4 text-sm text-muted-foreground pr-2">
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.overviewTitle}</h3>
              <p dangerouslySetInnerHTML={{ __html: T.overviewText }} />
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.headerBarTitle}</h3>
              <ul className="list-disc list-inside space-y-1">
                {T.headerBarItems.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.examInfoCardTitle}</h3>
              <p dangerouslySetInnerHTML={{ __html: T.examInfoCardText }} />
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.timerCardTitle}</h3>
              <ul className="list-disc list-inside space-y-1">
                 {T.timerCardItems.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ul>
            </section>
             <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.dataPersistenceTitle}</h3>
              <p dangerouslySetInnerHTML={{ __html: T.dataPersistenceText }} />
            </section>
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">{T.tipsTitle}</h3>
              <ul className="list-disc list-inside space-y-1">
                {T.tipsItems.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ul>
            </section>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose}>{T.closeButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
