"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const common_1 = require("@nestjs/common");
const STATIC_DIR = (0, path_1.join)(__dirname, '..', '..', 'static');
let VideoService = class VideoService {
    findAll() {
        return `This action returns all video`;
    }
    findOne(WORKING_DIR) {
        const filePath = (0, path_1.join)(STATIC_DIR, WORKING_DIR, 'data.json');
        const data = (0, fs_1.readFileSync)(filePath, 'utf8');
        return JSON.parse(data);
    }
    update(WORKING_DIR, updateVideoDto) {
        const filePath = (0, path_1.join)(STATIC_DIR, WORKING_DIR, 'data.json');
        (0, fs_1.writeFile)(filePath, JSON.stringify(updateVideoDto, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return;
            }
            console.log('JSON data has been written to', filePath);
        });
        return true;
    }
    remove(id) {
        return `This action removes a #${id} video`;
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)()
], VideoService);
//# sourceMappingURL=video.service.js.map