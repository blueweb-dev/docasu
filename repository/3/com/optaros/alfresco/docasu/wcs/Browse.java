package com.optaros.alfresco.docasu.wcs;

/*
 *    Copyright (C) 2008 Optaros, Inc. All rights reserved.
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.web.scripts.WebScriptRequest;
import org.alfresco.web.scripts.Status;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * @author Jean-Luc Geering
 */
public class Browse extends AbstractDocumentWebScript {

	private static final Log log = LogFactory.getLog(Browse.class);

	private boolean foldersOnly = false;

	public void setFoldersOnly(boolean foldersOnly) {
		this.foldersOnly = foldersOnly;
	}

	@Override
	protected Map<String, String> readParams(WebScriptRequest req) {

		Map<String, String> params = super.readParams(req);

		if (foldersOnly) {
			readParam(params, PARAM_NODE_ID, req.getParameter("node"));
		} // else already read by superclass

		if (log.isDebugEnabled()) {
			log.debug("FOLDERS_ONLY = " + foldersOnly);
			log.debug("PARAM nodeId = " + params.get(PARAM_NODE_ID));
		}

		return params;
	}

	@Override
	public Map<String, Object> executeImpl(WebScriptRequest req, Status status) {
		log.debug("*** Enter browse request handler ***");
		initServices();

		Map<String, String> params = readParams(req);

		NodeRef companyHome = repository.getCompanyHome();
		NodeRef baseNode = companyHome;

		if (params.get(PARAM_NODE_ID) != null) {
			baseNode = new NodeRef(storeRef, params.get(PARAM_NODE_ID));
		}

		FileInfo fileInfo = fileFolderService.getFileInfo(baseNode);
		String path = generatePath(baseNode);

		// list result set
		List<NodeRef> listResult = customFileFolderService.list(baseNode, foldersOnly);

		// sort results
		listResult = sort(listResult, params);

		// store the size of the search result
		int total = listResult.size();

		if (log.isDebugEnabled()) {
			log.debug("node is folder = " + fileInfo.isFolder());
			log.debug("node name = " + fileInfo.getName());
			log.debug("node path = " + path);
			log.debug("node children count = " + listResult.size());
		}

		if (!foldersOnly) {
			listResult = doPaging(listResult, params);
		}

		List<FileInfo> nodes = toFileInfo(listResult);

		Map<String, Object> model = new HashMap<String, Object>();
		model.put("total", total);
		model.put("path", path);
		model.put("randomNumber", Math.random());
		model.put("folderName", fileInfo.getName());
		model.put("folderId", baseNode.getId());
		model.put(KEYWORD_ROWS, getResultRows(nodes));

		log.debug("*** Exit browse request handler ***");
		return model;
	}

	private Object[] getResultRows(List<FileInfo> nodes) {
		int i = 0;
		Object[] rows = new Object[nodes.size()];
		for (FileInfo info : nodes) {
			rows[i++] = toModelRow(info);
		}
		return rows;
	}
}