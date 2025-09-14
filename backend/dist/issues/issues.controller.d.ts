import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
export declare class IssuesController {
    private readonly issuesService;
    constructor(issuesService: IssuesService);
    create(createIssueDto: CreateIssueDto): Promise<import("./schemas/issue.schema").Issue>;
    findAll(): Promise<import("./schemas/issue.schema").Issue[]>;
    findOne(id: string): Promise<import("./schemas/issue.schema").Issue>;
    update(id: string, updateIssueDto: UpdateIssueDto): Promise<import("./schemas/issue.schema").Issue>;
    remove(id: string): Promise<import("./schemas/issue.schema").Issue>;
}
