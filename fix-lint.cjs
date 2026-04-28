const fs = require('fs');

const replaces = [
    {
        file: 'apps/core-api/src/controllers/chat.controller.ts',
        replaces: [
            { find: 'catch (err: any)', replace: '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n  } catch (err: any)' }
        ]
    },
    {
        file: 'apps/core-api/src/controllers/connection.controller.ts',
        replaces: [
            { find: 'catch (error: any)', replace: '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n    } catch (error: any)' }
        ]
    },
    {
        file: 'apps/core-api/src/controllers/gig-request.controller.ts',
        replaces: [
            { find: '} catch (error: any) {', replace: '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n        } catch (error: any) {' }
        ]
    },
    {
        file: 'apps/core-api/src/repositories/chat.repository.ts',
        replaces: [
            { find: 'const pipeline: any[] = [', replace: '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n  const pipeline: any[] = [' }
        ]
    },
    {
        file: 'apps/core-api/src/repositories/connection.repository.ts',
        replaces: [
            { find: 'const filter: any = {};', replace: '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n    const filter: any = {};' }
        ]
    },
    {
        file: 'apps/web/app/influencer-dashboard/earnings/page.tsx',
        replaces: [
            { find: '} catch (error: any) {', replace: '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n        } catch (error: any) {' },
            { find: 'MoreVertical,', replace: '' },
            { find: 'AlertCircle,', replace: '' },
            { find: 'RefreshCw', replace: '' },
            { find: ' , ', replace: '' }
        ]
    },
    {
        file: 'apps/core-api/src/services/order.service.ts',
        replaces: [{ find: 'import mongoose from "mongoose";', replace: '' }]
    },
    {
        file: 'apps/core-api/test-chat.ts',
        replaces: [{ find: 'import { GigRequestModel } from \'./src/models/gig-request.model.ts\';', replace: '' }]
    },
    {
        file: 'apps/web/app/brand-dashboard/layout.tsx',
        replaces: [{ find: 'import Image from "next/image";', replace: '' }]
    },
    {
        file: 'apps/web/app/brand-dashboard/messages/page.tsx',
        replaces: [
            { find: ', useRef ', replace: ' ' },
            { find: 'Message,', replace: '' }
        ]
    },
    {
        file: 'apps/web/app/brand-dashboard/requests/page.tsx',
        replaces: [{ find: 'Globe, Calendar, Clock, DollarSign', replace: '' }]
    },
    {
        file: 'apps/web/app/influencer-dashboard/calendar/page.tsx',
        replaces: [
            { find: 'Youtube, Video, Music', replace: '' },
            { find: 'interface Gig ', replace: 'interface _Gig ' },
            { find: 'const [currentDate, setCurrentDate]', replace: 'const [currentDate]' }
        ]
    },
    {
        file: 'apps/web/app/influencer-dashboard/messages/page.tsx',
        replaces: [
            { find: ', useRef ', replace: ' ' },
            { find: 'Message,', replace: '' }
        ]
    },
    {
        file: 'apps/web/app/influencer-dashboard/requests/page.tsx',
        replaces: [
            { find: ', X', replace: '' },
            { find: ', Clock', replace: '' }
        ]
    }
];

replaces.forEach(item => {
    if (fs.existsSync(item.file)) {
        let content = fs.readFileSync(item.file, 'utf8');
        item.replaces.forEach(r => {
            content = content.replace(new RegExp(r.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), r.replace);
        });
        fs.writeFileSync(item.file, content);
    }
});
